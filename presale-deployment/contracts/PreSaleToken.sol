//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;


import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";


interface StakingManager {
  function depositByPresale(address _user, uint256 _amount) external;
}

contract PreSaleToken is Initializable,  OwnableUpgradeable, ReentrancyGuardUpgradeable,PausableUpgradeable {

  uint256 public totalTokensSold;
  uint256 public startTime;
  uint256 public endTime;
  uint256 public claimStart;
  address public saleToken;
  uint256 public baseDecimals;
  uint256 public maxTokensToBuy;
  uint256 public currentStep;
  uint256 public checkPoint;
  uint256 public timeConstant;
  uint256 public totalBoughtAndStaked;
  uint256[][1] public rounds;
  uint256[] public prevCheckpoints;
  uint256[] public remainingTokensTracker;
  uint256[] public percentages;
  address[] public wallets;
  address public paymentWallet;
  address public admin;
  bool public dynamicTimeFlag;
  bool public stakingWhitelistStatus;
  uint256  timeIncrement;
  uint256  priceIncrement;
  uint256  tokenIncrement;
  uint256  presaleTime;
  uint256 public maxRounds;

  mapping(address => uint256) public userDeposits;
  mapping(address => bool) public hasClaimed;
  

  StakingManager public stakingManagerInterface;

  event SaleTimeSet(uint256 _start, uint256 _end, uint256 timestamp);
  event SaleTimeUpdated(bytes32 indexed key, uint256 prevValue, uint256 newValue, uint256 timestamp);
  event TokensBought(address indexed user, uint256 indexed tokensBought, address indexed purchaseToken, uint256 amountPaid, uint256 usdEq, uint256 timestamp);
  event TokensAdded(address indexed token, uint256 noOfTokens, uint256 timestamp);
  event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
  event ClaimStartUpdated(uint256 prevValue, uint256 newValue, uint256 timestamp);
  event MaxTokensUpdated(uint256 prevValue, uint256 newValue, uint256 timestamp);
  event TokensBoughtAndStaked(address indexed user, uint256 indexed tokensBought, address indexed purchaseToken, uint256 amountPaid, uint256 usdEq, uint256 timestamp);
  event TokensClaimedAndStaked(address indexed user, uint256 amount, uint256 timestamp);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() initializer {}


  function initialize() public initializer {
      __Ownable_init();
      __ReentrancyGuard_init();
      __Pausable_init();

      // Initialize key variables
      totalTokensSold = 0;
      baseDecimals = 10**18;
      maxTokensToBuy = 10000000; // * baseDecimals - 10 million;
      timeConstant = 86400; // 1 day in seconds
      currentStep = 0;
      checkPoint = 0;
      stakingWhitelistStatus = false;
      dynamicTimeFlag = true;

      startTime = block.timestamp; // Current block timestamp
      endTime = block.timestamp + 90 days; // 90 days from now

      timeIncrement = 86400;
      priceIncrement = 3200000000000000;
      tokenIncrement = 32000000;
      presaleTime = 1737298267;
}


    
  /**
   * @dev To pause the presale
   */
  function pause() external onlyOwner {
    _pause();
  }

  /**
   * @dev To unpause the presale
   */
  function unpause() external onlyOwner {
    _unpause();
  }


  /**
   * @dev To change the claim start time by the owner
   * @param _presaleTime new claim start time
   */
  function changePresaleTime(uint256 _presaleTime) external onlyOwner returns (bool) {
    require(_presaleTime > endTime, "Sale in progress");
    require(_presaleTime > block.timestamp, "Start time must be greater than end time.Sale in progress");
    uint256 prevValue = presaleTime;
    presaleTime = _presaleTime;
    emit ClaimStartUpdated(prevValue, _presaleTime, block.timestamp);
    return true;
  }

  /**
   * @dev To calculate the price in USD for given amount of tokens.
   * @param _amount No of tokens
   */
  function calculatePrice(uint256 _amount) public view returns (uint256) {
    uint256 USDTAmount;
    uint256 total = checkPoint == 0 ? totalTokensSold : checkPoint;

    uint256 nextStepToken = tokenIncrement * (currentStep + 1);
    uint256 nextPrice = priceIncrement * (currentStep + 1);

    uint256 currentStepToken = tokenIncrement * (currentStep);
    uint256 currentPrice = priceIncrement * (currentStep);
    uint256 currentTime = presaleTime + (timeIncrement * (currentStep)); 

    if(currentStep < 1)
    {
      currentStepToken = tokenIncrement;
      currentPrice = priceIncrement;
      currentTime = presaleTime + timeIncrement;
    }  

    require(_amount <= maxTokensToBuy, "Amount exceeds max tokens to buy");
    if (_amount + total > currentStepToken || block.timestamp >= currentTime) {

      if (block.timestamp >= currentTime) {
        require(currentStepToken + _amount <= nextStepToken, "Cant Purchase More in individual tx");
        USDTAmount = _amount * nextPrice;
      } else {
        uint256 tokenAmountForCurrentPrice = currentStepToken - total;
        USDTAmount = tokenAmountForCurrentPrice * currentPrice + (_amount - tokenAmountForCurrentPrice) * nextPrice;
      }
    } else USDTAmount = _amount * currentPrice;
    return USDTAmount;
  }

  /**
   * @dev To update the sale times
   * @param _startTime New start time
   * @param _endTime New end time
   */
  function changeSaleTimes(uint256 _startTime, uint256 _endTime) external onlyOwner {
    require(_startTime > 0 || _endTime > 0, "Invalid parameters");
    if (_startTime > 0) {
      require(block.timestamp < startTime, "Sale already started");
      require(block.timestamp < _startTime, "Sale time in past");
      uint256 prevValue = startTime;
      startTime = _startTime;
      emit SaleTimeUpdated(bytes32("START"), prevValue, _startTime, block.timestamp);
    }
    if (_endTime > 0) {
      require(_endTime > startTime, "Invalid endTime");
      uint256 prevValue = endTime;
      endTime = _endTime;
      emit SaleTimeUpdated(bytes32("END"), prevValue, _endTime, block.timestamp);
    }
  }

  /**
   * @dev To get current Block Time
   */
  function getCurrentBlockTime() public view returns (uint256) {
    return uint256(block.timestamp);
  }

  function getTokenRounds(uint256 round) public view returns (uint256) {
    return  uint256 (tokenIncrement * (round+1));
  }


  function setSplits(address[] memory _wallets, uint256[] memory _percentages) public onlyOwner {
    require(_wallets.length == _percentages.length, "Mismatched arrays");
    delete wallets;
    delete percentages;
    uint256 totalPercentage = 0;

    for (uint256 i = 0; i < _wallets.length; i++) {
      require(_percentages[i] > 0, "Percentage must be greater than 0");
      totalPercentage += _percentages[i];
      wallets.push(_wallets[i]);
      percentages.push(_percentages[i]);
    }

    require(totalPercentage == 100, "Total percentage must equal 100");
  }

  modifier checkSaleState(uint256 amount) {
    require(block.timestamp >= startTime && block.timestamp <= endTime, "Invalid time for buying");
    require(amount > 0, "Invalid sale amount");
    _;
  }

  /**
   * @dev To buy into a presale using ETH
   * @param amount No of tokens to buy
   * @param stake boolean flag for token staking
   */
  function buyLoanToken(uint256 amount, bool stake) external payable checkSaleState(amount) whenNotPaused nonReentrant returns (bool) {

    require(maxRounds != 0, "Maximum rounds is not set");

    require(currentStep >= maxRounds, "Presale is completed ");

    uint256 ethAmount = calculatePrice(amount);
    uint256 currentStepToken = tokenIncrement * (currentStep);
    uint256 currentTime = presaleTime + (timeIncrement * (currentStep));

    if(currentStep < 1)
    {
      currentStepToken = tokenIncrement;
      currentTime = presaleTime + timeIncrement;
    }  
    require(msg.value >= ethAmount, "Less payment");
    uint256 excess = msg.value - ethAmount;
    totalTokensSold += amount;
    if (checkPoint != 0) checkPoint += amount;
    uint256 total = totalTokensSold > checkPoint ? totalTokensSold : checkPoint;
    if (total > currentStepToken || block.timestamp >= currentTime) {
      if (block.timestamp >= currentTime) {
        checkPoint = currentStepToken + amount;
      }
      if (dynamicTimeFlag) {
        manageTimeDiff();
      }
      uint256 unsoldTokens = total > currentStepToken ? 0 : currentStepToken - total - amount;
      remainingTokensTracker.push(unsoldTokens);
      currentStep += 1;
    }
    if (stake) {
      stakingManagerInterface.depositByPresale(_msgSender(), amount * baseDecimals);
      totalBoughtAndStaked += amount;
      emit TokensBoughtAndStaked(_msgSender(), amount, address(0), ethAmount, ethAmount, block.timestamp);
    } else {
      userDeposits[_msgSender()] += (amount * baseDecimals);
      emit TokensBought(_msgSender(), amount, address(0), ethAmount, ethAmount, block.timestamp);
    }
    splitETHValue(ethAmount);
    if (excess > 0) sendValue(payable(_msgSender()), excess);
    return true;
  }


  function sendValue(address payable recipient, uint256 amount) internal {
    require(address(this).balance >= amount, "Low balance");
    (bool success, ) = recipient.call{value: amount}("");
    require(success, "ETH Payment failed");
  }

  function splitETHValue(uint256 _amount) internal {
    if (wallets.length == 0) {
      require(paymentWallet != address(0), "Payment wallet not set");
      sendValue(payable(paymentWallet), _amount);
    } else {
      uint256 tempCalc;
      for (uint256 i = 0; i < wallets.length; i++) {
        uint256 amountToTransfer = (_amount * percentages[i]) / 100;
        sendValue(payable(wallets[i]), amountToTransfer);
        tempCalc += amountToTransfer;
      }
      if ((_amount - tempCalc) > 0) {
        sendValue(payable(wallets[wallets.length - 1]), _amount - tempCalc);
      }
    }
  }



  /**
   * @dev to initialize staking manager with new addredd
   * @param _stakingManagerAddress address of the staking smartcontract
   */
  function setStakingManager(address _stakingManagerAddress) external onlyOwner {
    require(_stakingManagerAddress != address(0), "staking manager cannot be inatialized with zero address");
    stakingManagerInterface = StakingManager(_stakingManagerAddress);
    IERC20Upgradeable(saleToken).approve(_stakingManagerAddress, type(uint256).max);
  }

  /**
   * @dev To set the claim start time and sale token address by the owner
   * @param _claimStart claim start time
   * @param noOfTokens no of tokens to add to the contract
   * @param _saleToken sale toke address
   */
  function startClaim(uint256 _claimStart, uint256 noOfTokens, address _saleToken, address _stakingManagerAddress) external onlyOwner returns (bool) {
    require(_saleToken != address(0), "Zero token address");
    // require(claimStart == 0, "Claim already set");
    claimStart = _claimStart;
    saleToken = _saleToken;
    stakingManagerInterface = StakingManager(_stakingManagerAddress);
    IERC20Upgradeable(_saleToken).approve(_stakingManagerAddress, type(uint256).max);
    bool success = IERC20Upgradeable(_saleToken).transferFrom(_msgSender(), address(this), noOfTokens);
    require(success, "Token transfer failed");
    emit TokensAdded(_saleToken, noOfTokens, block.timestamp);
    return true;
  }

  /**
   * @dev To set status for claim whitelisting
   * @param _status bool value
   */
  function setStakingWhitelistStatus(bool _status) external onlyOwner {
    stakingWhitelistStatus = _status;
  }

  /**
   * @dev To change the claim start time by the owner
   * @param _claimStart new claim start time
   */
  function changeClaimStart(uint256 _claimStart) external onlyOwner returns (bool) {
    require(claimStart > 0, "Initial claim data not set");
    require(_claimStart > endTime, "Sale in progress");
    require(_claimStart > block.timestamp, "Claim start in past");
    uint256 prevValue = claimStart;
    claimStart = _claimStart;
    emit ClaimStartUpdated(prevValue, _claimStart, block.timestamp);
    return true;
  }


  /**
   * @dev To claim tokens after claiming starts
   */
  function claim() external whenNotPaused returns (bool) {
    require(saleToken != address(0), "Sale token not added");

    require(block.timestamp >= claimStart, "Claim has not started yet");
    require(!hasClaimed[_msgSender()], "Already claimed");
    hasClaimed[_msgSender()] = true;
    uint256 amount = userDeposits[_msgSender()];
    require(amount > 0, "Nothing to claim");
    delete userDeposits[_msgSender()];
    bool success = IERC20Upgradeable(saleToken).transfer(_msgSender(), amount);
    require(success, "Token transfer failed");
    emit TokensClaimed(_msgSender(), amount, block.timestamp);
    return true;
  }

  function claimAndStake() external whenNotPaused returns (bool) {
    require(saleToken != address(0), "Sale token not added");
    uint256 amount = userDeposits[_msgSender()];
    require(amount > 0, "Nothing to stake");
    stakingManagerInterface.depositByPresale(_msgSender(), amount);
    delete userDeposits[_msgSender()];
    emit TokensClaimedAndStaked(_msgSender(), amount, block.timestamp);
    return true;
  }



  function changeMaxTokensToBuy(uint256 _maxTokensToBuy) external onlyOwner {
    require(_maxTokensToBuy > 0, "Zero max tokens to buy value");
    uint256 prevValue = maxTokensToBuy;
    maxTokensToBuy = _maxTokensToBuy;
    emit MaxTokensUpdated(prevValue, _maxTokensToBuy, block.timestamp);
  }

  /**
   * @dev To set payment wallet address
   * @param _newPaymentWallet new payment wallet address
   */
  function changePaymentWallet(address _newPaymentWallet) external onlyOwner {
    require(_newPaymentWallet != address(0), "address cannot be zero");
    paymentWallet = _newPaymentWallet;
  }



  /**
   * @dev To set time constant for manageTimeDiff()
   * @param _timeConstant time in <days>*24*60*60 format
   */
  function setTimeConstant(uint256 _timeConstant) external onlyOwner {
    timeConstant = _timeConstant;
  }

  /**
   * @dev To manage time gap between two rounds 123123
   */
  function manageTimeDiff() internal {
      rounds[0].push(block.timestamp + currentStep * timeConstant);
  }

  function roundDetails() external view returns (uint256[] memory) {
    return rounds[0];
  }

  /**
   * @dev to update userDeposits for purchases made on BSC
   * @param _users array of users
   * @param _userDeposits array of userDeposits associated with users
   */
  function updateFromBSC(address[] calldata _users, uint256[] calldata _userDeposits) external onlyOwner {
    require(_users.length == _userDeposits.length, "Length mismatch");
    for (uint256 i = 0; i < _users.length; i++) {
      userDeposits[_users[i]] += _userDeposits[i];
    }
  }

  /**
   * @dev To increment the rounds from backend
   */
  function incrementCurrentStep() external {
    require(msg.sender == admin || msg.sender == owner(), "caller not admin or owner");
    prevCheckpoints.push(checkPoint);
    if (dynamicTimeFlag) {
      manageTimeDiff();
    }
    uint256 currentStepToken = tokenIncrement * (currentStep+1);

    if(currentStep < 1)
    {
      currentStepToken = tokenIncrement;
    }
    
    if (checkPoint < currentStepToken) {
      if (currentStep == 0) {
        remainingTokensTracker.push(currentStepToken - totalTokensSold);
      } else {
        remainingTokensTracker.push(currentStepToken - checkPoint);
      }
      checkPoint = currentStepToken;
    }
    currentStep++;
  }

  /**
   * @dev To set admin
   * @param _admin new admin wallet address
   */
  function setAdmin(address _admin) external onlyOwner {
    admin = _admin;
  }

  /**
   * @dev To change details of the round
   * @param _step round for which you want to change the details
   * @param _checkpoint token tracker amount
   */
  function setCurrentStep(uint256 _step, uint256 _checkpoint) external onlyOwner {
    currentStep = _step;
    checkPoint = _checkpoint;
  }

    // Set the price increments in each rounds
    function setPriceIncrement(uint256 _priceIncrement) public onlyOwner {
        priceIncrement = _priceIncrement;
    }

    // Set when the presale should start
    function setPresaleTime(uint256 _presaleTime) public onlyOwner {
        require(currentStep == 0, "Pre-Sale already crossed Round-1");
        presaleTime = _presaleTime;
    }

    // Set Maximum rounds
    function setMaxRounds(uint256 _maxRounds) public onlyOwner {
        maxRounds = _maxRounds;
    }

    // Time increment between two rounds
    function getTimeIncrement() public view returns (uint256) {
        return timeIncrement;
    }

    /** Price increment value between two rounds */
    function getPriceIncrement() public view returns (uint256) {
        return priceIncrement;
    }

    /** Token increment between two rounds */
    function getTokenIncrement() public view returns (uint256) {
        return tokenIncrement;
    }

  /** Get the when is the pre-sale is starting time */
    function getPresaleTime() public view returns (uint256) {
        return presaleTime;
    }

  /** Get the Maximum round set here */
    function getMaxRounds() public view returns (uint256) {
        return maxRounds;
    }

  /**
   * @dev To set time shift functionality on/off
   * @param _dynamicTimeFlag bool value
   */
  function setDynamicTimeFlag(bool _dynamicTimeFlag) external onlyOwner {
    dynamicTimeFlag = _dynamicTimeFlag;
  }

  /**
   * @dev     Function to return remainingTokenTracker Array
   */
  function trackRemainingTokens() external view returns (uint256[] memory) {
    return remainingTokensTracker;
  }

  /**
   * @dev     To update remainingTokensTracker Array
   * @param   _unsoldTokens  input parameters in uint256 array format
   */
  function setRemainingTokensArray(uint256[] memory _unsoldTokens) public {
    require(msg.sender == admin || msg.sender == owner(), "caller not admin or owner");
    require(_unsoldTokens.length != 0, "cannot update invalid values");
    delete remainingTokensTracker;
    for (uint256 i; i < _unsoldTokens.length; i++) {
      remainingTokensTracker.push(_unsoldTokens[i]);
    }
  }
}

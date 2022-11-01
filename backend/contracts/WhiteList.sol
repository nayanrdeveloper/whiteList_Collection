// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract WhiteList {
    uint8 public maxWhitelistAddresses;

    mapping (address => bool) public whiteListAddresses;

    constructor(uint8 _maxWhitelistAddress) {
        maxWhitelistAddresses = _maxWhitelistAddress;
    }

    uint8 public numAddressesWhiteListed;

    function addAddressToWhiteList() public {
        require(!whiteListAddresses[msg.sender],"Sender has already been whitelisted");
        require(numAddressesWhiteListed < maxWhitelistAddresses, "More addresses can be added, limit reached");
        whiteListAddresses[msg.sender] = true;
        numAddressesWhiteListed += 1;
    }
}
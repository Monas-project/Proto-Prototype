// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RootIdStore is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}

    mapping(address => string) private userRootIds;

    event UpdateRootId(
        address indexed user,
        string indexed rootId
    );

    function updateRootId(address user, string memory cid) public onlyOwner {
        userRootIds[user] = cid;
        emit UpdateRootId(user, cid);
    }

    function getRootId(address user) public view returns (string memory){
        return userRootIds[user];
    }
}

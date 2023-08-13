// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

error Donations__InvalidDeadline();
error Donations__DonationFailed();

contract Donations {
    struct Campaign {
        address i_owner;
        string title;
        uint256 deadline;
        string description;
        uint256 target;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    uint256 private s_numberOfCampaigns;

    mapping(uint256 => Campaign) campaigns;

    constructor() {
        s_numberOfCampaigns = 0;
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public {
        if (_deadline < block.timestamp) revert Donations__InvalidDeadline();

        Campaign storage campaign = campaigns[s_numberOfCampaigns];

        campaign.i_owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.amountCollected = 0;

        s_numberOfCampaigns++;
    }

    function donateCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donations.push(amount);
        campaign.donators.push(msg.sender);

        (bool sent, ) = payable(campaign.i_owner).call{value: amount}("");

        if (sent) campaign.amountCollected += amount;
        else revert Donations__DonationFailed();
    }

    function getNumberOfCampaigns() public view returns (uint256) {
        return s_numberOfCampaigns;
    }

    function getDonatorsAndDonations(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](s_numberOfCampaigns);

        for (uint256 i = 0; i < s_numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }

        return allCampaigns;
    }
}

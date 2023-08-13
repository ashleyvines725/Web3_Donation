import React, { useContext, createContext } from "react";
import {
    useAddress,
    useContract,
    useMetamask,
    useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(
        "0xDBffE87f6502e5D1812250d932f6c101460C5481"
    );

    const { mutateAsync: createCampaign } = useContractWrite(
        contract,
        "createCampaign"
    );

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            // { args: [_owner, _title, _description, _target, _deadline, _image] }
            const data = await createCampaign({
                args: [
                    address,
                    form.title,
                    form.description,
                    form.target,
                    new Date(form.deadline).getTime(),
                    form.image,
                ],
            });
            console.log("contract call success : ", data);
        } catch (err) {
            console.log("contract call failed : ", err);
        }
    };

    const getCampaigns = async () => {
        const campaigns = await contract.call("getAllCampaigns");
        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.i_owner,
            title: campaign.title,
            description: campaign.title,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(
                campaign.amountCollected.toString()
            ),
            image: campaign.image,
            pId: i,
        }));

        return parsedCampaigns;
    };

    const getUserCompaigns = async () => {
        const allCampaigns = await getCampaigns();

        const userCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner === address
        );

        return userCampaigns;
    };

    const donate = async (pId, amount) => {
        const data = await contract.call("donateCampaign", [pId], {
            value: ethers.utils.parseEther(amount),
        });

        return data;
    };

    const getDonations = async (pId) => {
        const donations = await contract.call("getDonatorsAndDonations", [pId]);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString()),
            });
        }

        return parsedDonations;
    };

    return (
        <StateContext.Provider
            value={{
                address,
                connect,
                createCampaign: publishCampaign,
                contract,
                getCampaigns,
                getUserCompaigns,
                donate,
                getDonations,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);

import React, { useState, useEffect } from "react";
import { Button, notification } from "antd";
import { Group } from "antd/lib/avatar";

export const NeoDemo1 = () => {
  const [state, setState] = useState(0);
  const [neoline, setNeoLine] = useState();
  const [blockHeight, setBlockHeight] = useState("78115");
  const [account, setAccount] = useState("");
  const [data, setData] = useState([]);
  const [publicKeyData, setPublicKey] = useState("");
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    window.addEventListener("NEOLine.NEO.EVENT.READY", () => {
      setNeoLine(new window.NEOLineN3.Init());
      setState(1);
      setBlockHeight(78115);
    });
  }, []);

  // const initO3Account = async () => {
  //     try {
  //         const { address } = await neoDapi.getAccount()
  //         setAccount(address);
  //         setNeoLine(neoDapi);

  //     } catch (error) {
  //         console.log(error);
  //         notification.error({ message: 'O3', description: error.type })
  //     }
  // }

  const initNeolineAccount = async () => {
    try {
      const { address } = await neoline.getAccount();
      setAccount(address);
    } catch (error) {
      console.log(error);
      notification.error({ message: "NeoLine", description: error.type });
    }
  };

  const getBalance = async () => {
    const params = {
      params: [
        {
          address: "NdJqYNVK99srFABQDLPdrpz2By1RX1sLvr",
          contracts: [
            "0xd2a4cff31913016155e38e474a2c06d08be276cf",
            "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b",
          ],
        },
      ],
    };
    const ret = await neoline.getBalance(params);
    console.log(ret);
    setBalance(ret[account]);
  };

  const handleChange = async (event) => {
    console.log(event);
    setBlockHeight(event.target.value);
  };

  const handleSubmit = async () => {
    console.log(blockHeight);
    const blockDetails = await neoline.getBlock({
      blockHeight: parseInt(blockHeight),
    });
    console.log(blockDetails);
    setData({ blockDetails: blockDetails });
    // setBalance(ret[account])
  };

  const getPublicKey = async () => {
    const publicKeyData = await neoline.getPublicKey();
    console.log(publicKeyData);
    setPublicKey(publicKeyData);
    // setBalance(ret[account])
  };

  const invoke = async () => {};

  const mixToken = async (asset) => {
    const contract_data2 = {
      scriptHash: "86a252711c8dbf1a30656cb501ab2cb657eeedab",
      operation: "Mint",
      args: [
        {
          type: "Hash160", //大端
          value: 1,
        },
        {
          type: "Integer",
          value: 2,
        },
        {
          type: "Address",
          value: account,
        },
      ],
      // network: 'TestNet',
    };
    try {
      const ret1 = await neoline.invoke(contract_data2);
      console.log(ret1);
    } catch (err) {
      console.log(err);
    }
  };
  const balance_array = [];
  balance.forEach((ele) => {
    balance_array.push(
      <div key={ele.symbol} className="btt">
        {ele.symbol}: &nbsp;<b>{ele.amount} </b>
      </div>
    );
  });

  // if(data && data.blockDetails){
  //     for (const property in data.blockDetails) {
  //         tableBody.push(<td key={property}><b>{data.blockDetails[property]} </b></td>)
  //     }
  //     console.log(tableBody)
  // }

  return (
    <div className="web3demo">
      {state === 0 && (
        <div className="message">
          There is currently no wallet linked, please install Neoline Chrome
          Plugin
        </div>
      )}
      {state === 1 && (
        <div className="message">
          <div className="btt top-btn">
            <Button onClick={initNeolineAccount}>Connect Neoline</Button>
          </div>
          {account && (
            <div>
              <div className="account">
                Current Account: <b>{account}</b>
              </div>
              <hr />
              <div className="btt">
                <Button
                  onClick={() => {
                    getBalance();
                    getPublicKey();
                  }}
                >
                  Get Account Info
                </Button>
              </div>
              {balance_array}
              {publicKeyData && (
                <div>
                  <div className="btt">
                    Account address : <b>{publicKeyData.address}</b>
                  </div>
                  <div className="btt">
                    Account public key : <b>{publicKeyData.publicKey}</b>
                  </div>
                  <hr />{" "}
                </div>
              )}
              <form>
                <label>
                  Enter Block Number :&nbsp;
                  <input
                    type="text"
                    value={blockHeight}
                    onChange={handleChange}
                  />
                </label>{" "}
                &nbsp;
                <Button onClick={handleSubmit}>Get Block Details</Button>
              </form>

              {data && data.blockDetails && (
                <table
                  className="table table-bordered table-hover"
                  width="100%"
                >
                  <thead>
                    <tr>
                      <th>Confirmations</th>
                      <th>Hash</th>
                      <th>Index</th>
                      <th>Size</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data.blockDetails.confirmations}</td>
                      <td>{data.blockDetails.hash}</td>
                      <td>{data.blockDetails.index}</td>
                      <td>{data.blockDetails.size}</td>
                      <td>
                        {new Date(data.blockDetails.time).getMonth() +
                          1 +
                          "/" +
                          new Date(data.blockDetails.time).getDate() +
                          "/" +
                          new Date(data.blockDetails.time).getFullYear()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* <div className="btt">
                        <Button onClick={getNetwork}>Get Current Network</Button>
                    </div> */}
            </div>
          )}
          {/* <Group>
                        <div className="btt">
                            <Button onClick={invoke}>invoke1</Button>
                        </div>
                    </Group>
                    <Group>
                        <div className="btt">
                            <div>"para1","para2</div>
                            <Button onClick={() => mixToken("para1","para2")}>invokeTest1</Button>
                        </div>
                    </Group> */}
        </div>
      )}
    </div>
  );
};

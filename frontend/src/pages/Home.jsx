import React, { useContext, useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import GameCard from "../components/GameCard";
import CreateCard from "../components/CreateCard";
import io from "socket.io-client";

const Home = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useContext(AppContext);
  const [winnerInfo, setWinnerInfo] = useState(null);

  const fetchAllActiveBets = useCallback(async () => {
    try {
      const response = await fetch("/api/bet/getactivebet", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setActiveBets(data.bet || []);
    } catch (error) {
      console.error("Error fetching active bets:", error);
    }
  }, []);

  const handleBetResult = useCallback(
    (betData) => {
      console.log("betdata", betData);
      if (!user?.id) return;

      const { bet } = betData;
      const isUserHead = user.id === bet.user_head;
      const isUserTail = user.id === bet.user_tail;

      // Store winner info with the specific bet ID
      setWinnerInfo({
        betId: bet.id,
        result: bet.result,
      });

      if (
        (isUserHead && bet.result === "head") ||
        (isUserTail && bet.result === "tail")
      ) {
        console.log("You Win!");
        // Handle win logic here
      } else if (isUserHead || isUserTail) {
        console.log("You Lost!");
        // Handle loss logic here
      }

      setTimeout(() => {
        fetchAllActiveBets();
        // Clear winner info after 5 seconds
        setWinnerInfo(null);
      }, 5000);
    },
    [user, fetchAllActiveBets]
  );

  // Initialize socket connection once
  useEffect(() => {
    const newSocket = io.connect(
      import.meta.env.PROD
        ? "http://47.129.34.40:8001"
        : "http://localhost:8001"
    );
    setSocket(newSocket);

    // Clean up socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new bets
    socket.on("bet_created_from_backend", (data) => {
      console.log("New bet created:", data);
      fetchAllActiveBets();
    });

    // Listen for bet joins/results
    socket.on("join_bet_from_backend", handleBetResult);

    // Listen for deleted bets
    socket.on("delete_entry_from_backend", (data) => {
      console.log("Bet deleted ID:", data);
      fetchAllActiveBets();
    });

    // Fetch active bets on component mount
    fetchAllActiveBets();

    // Clean up event listeners on unmount or when dependencies change
    return () => {
      socket.off("bet_created_from_backend");
      socket.off("join_bet_from_backend");
    };
  }, [socket, fetchAllActiveBets, handleBetResult]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex-grow h-full px-44 py-10 bg-[#121820]">
        <div className="flex  h-full">
          {/* Room Container Component */}
          <div className="w-4/5 p-5 grid grid-cols-4 gap-4 h-fit max-h-full overflow-y-auto">
            <CreateCard
              fetchAllActiveBets={fetchAllActiveBets}
              socket={socket}
            />
            {activeBets.map((bet, index) => {
              const isHeadSide = !!bet.user_head;
              const headPetNames = bet.head_pets.map((pet) => pet.name);
              const tailPetNames = bet.tail_pets.map((pet) => pet.name);
              const headPetTotalValue = bet.head_pets.reduce(
                (sum, pet) => sum + pet.value,
                0
              );
              const tailPetTotalValue = bet.tail_pets.reduce(
                (sum, pet) => sum + pet.value,
                0
              );

              return (
                <div key={bet.id || index}>
                  <GameCard
                    socket={socket}
                    winner={
                      winnerInfo?.betId === bet.id ? winnerInfo.result : null
                    }
                    name={
                      isHeadSide
                        ? bet.user_head?.username
                        : bet.user_tail?.username
                    }
                    bet={isHeadSide ? headPetNames : tailPetNames}
                    value={isHeadSide ? headPetTotalValue : tailPetTotalValue}
                    side={isHeadSide ? "Head" : "Tail"}
                    betId={bet.id}
                  />
                </div>
              );
            })}
          </div>
          {/* All Chat component */}
          <div className="w-1/5 h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;

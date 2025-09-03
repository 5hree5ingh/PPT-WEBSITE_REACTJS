import React from 'react';
import jLogo from '../../../assests/teams-logo/j.j.png';
import anilLogo from '../../../assests/teams-logo/anil.png';
import fezzLogo from '../../../assests/teams-logo/fezz.png';
import safuLogo from '../../../assests/teams-logo/safu.png';
import adityaLogo from '../../../assests/teams-logo/aditya.png';
import brandonLogo from '../../../assests/teams-logo/brandon.png';
import padokdaLogo from '../../../assests/teams-logo/padokda.png';
import eternatusLogo from '../../../assests/teams-logo/eternatus.png';

const TeamsTab = () => {
  const teams = [
    {
      id: 1,
      captain: "Captain J.J",
      logo: jLogo,
      category: "Category A",
      players: [
        { name: "J.J", credits: "1500" },
        { name: "Rahul", credits: "1200" },
        { name: "Priya", credits: "1350" },
        { name: "Amit", credits: "1100" },
        { name: "Neha", credits: "1250" }
      ]
    },
    {
      id: 2,
      captain: "Captain Anil",
      logo: anilLogo,
      category: "Category B",
      players: [
        { name: "Anil", credits: "1600" },
        { name: "Suresh", credits: "1400" },
        { name: "Kavya", credits: "1550" },
        { name: "Raj", credits: "1300" },
        { name: "Pooja", credits: "1450" }
      ]
    },
    {
      id: 3,
      captain: "Captain Fezz",
      logo: fezzLogo,
      category: "Category C",
      players: [
        { name: "Fezz", credits: "1700" },
        { name: "Vikram", credits: "1500" },
        { name: "Anjali", credits: "1650" },
        { name: "Deepak", credits: "1400" },
        { name: "Meera", credits: "1550" }
      ]
    },
    {
      id: 4,
      captain: "Captain Safu",
      logo: safuLogo,
      category: "Category D",
      players: [
        { name: "Safu", credits: "1800" },
        { name: "Arjun", credits: "1600" },
        { name: "Divya", credits: "1750" },
        { name: "Karan", credits: "1500" },
        { name: "Shweta", credits: "1650" }
      ]
    },
    {
      id: 5,
      captain: "Captain Aditya",
      logo: adityaLogo,
      category: "Category E",
      players: [
        { name: "Aditya", credits: "1900" },
        { name: "Rohan", credits: "1700" },
        { name: "Tanvi", credits: "1850" },
        { name: "Akshay", credits: "1600" },
        { name: "Ishita", credits: "1750" }
      ]
    },
    {
      id: 6,
      captain: "Captain Brandon",
      logo: brandonLogo,
      category: "Category F",
      players: [
        { name: "Brandon", credits: "2000" },
        { name: "Yash", credits: "1800" },
        { name: "Zara", credits: "1950" },
        { name: "Harsh", credits: "1700" },
        { name: "Aisha", credits: "1850" }
      ]
    },
    {
      id: 7,
      captain: "Captain Padokda",
      logo: padokdaLogo,
      category: "Category G",
      players: [
        { name: "Padokda", credits: "2100" },
        { name: "Dev", credits: "1900" },
        { name: "Riya", credits: "2050" },
        { name: "Sahil", credits: "1800" },
        { name: "Ananya", credits: "1950" }
      ]
    },
    {
      id: 8,
      captain: "Captain Eternatus",
      logo: eternatusLogo,
      category: "Category H",
      players: [
        { name: "Eternatus", credits: "2200" },
        { name: "Krishna", credits: "2000" },
        { name: "Sneha", credits: "2150" },
        { name: "Vishal", credits: "1900" },
        { name: "Pratiksha", credits: "2050" }
      ]
    }
  ];

  return (
    <div className="teams-container">
      <h3 className="teams-title">REGISTERED TEAMS</h3>
      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card">
            <div className="team-header">
              <img src={team.logo} alt={`${team.captain} logo`} className="team-logo" />
              <div className="team-info">
                <h4 className="team-captain">{team.captain}</h4>

              </div>
            </div>
            <div className="team-players">
              <h5>TEAM MEMBERS</h5>
              <ul className="players-list">
                {team.players.map((player, index) => (
                  <li key={index} className="player-item">
                    <span className="player-name">{player.name}</span>
                    <span className="player-credits">{player.credits} CR</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamsTab;

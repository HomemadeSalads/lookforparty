import React, { useContext, useEffect, useState } from 'react';
import { Search, User, LogIn, LogOut, Shield, PlusCircle, Users, ChevronRight, Landmark, Wallet, Hammer, Anvil } from 'lucide-react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios  from 'axios';

const WoodQuestBoard = () => {

  // use context of logging in 
  const { currentUser } = useContext(AuthContext);
  const { id, username, link } = currentUser || {};

  const profilelink = `/profile/${id}`
  // if currenUser exist then isLoggedIn is true
  const isLoggedIn = (!!currentUser)
  const navigate = useNavigate();

  // check user is logged in or not
  useEffect(()=>{
    if (isLoggedIn === false){
      navigate("/login")
    }
  },[navigate,isLoggedIn])

  // when click logout or login
  const handleLoginClick = () =>{
      navigate("/login")
  }

  // to posting bounty
  const handlePostClick= () =>{
    navigate("/postbounty")
  }
  // clicking to deatail
  const handleDetail = (pid) =>{
    navigate(`/party/${pid}`)
  }
  // clicking to bank
  const handleBank = () =>{
    navigate(`/bank`)
  }

  // search bar
  const [inputs, setInputs] = useState({
    tag:"CN"
  });
  const handleChange = (e) =>{
      setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
  };
  const handleSearch = () =>{
    const {tag} = inputs;
    navigate(`/searchParty/${tag}`)
  }

  // getting post from backend
  const [posts,setPost] = useState([]);
  // get post that are not posted by user or member of
  useEffect(()=>{
          const FetchAllPost = async ()=>{
              try{
                  const res = await axios.post("http://localhost:8800/api/posts/getPost",{
                    id:id
                  })
                  setPost(res.data);
              }catch(err){
                  console.log(err)
              }
          }
          FetchAllPost()
      },[id])
      //console.log(posts)

  // getting party that you are in
  const [partys,setParty] = useState([]);
  useEffect(()=>{
          const FetchAllParty = async ()=>{
              try{
                  const res = await axios.post("http://localhost:8800/api/posts/getParty",{
                    id:id
                  })
                  console.log(res.data)
                  setParty(res.data);
              }catch(err){
                  console.log(err)
              }
          }
          FetchAllParty()
      },[id])
      //console.log(posts)

  // get Banking info => gold
  const [bank, setBank] = useState({});
  useEffect(()=>{
        const FetchBank = async ()=>{
        try{
            const res = await axios.post(`http://localhost:8800/api/user/getBank`,{
              id:id
            })
            console.log(res.data)
            setBank(res.data[0]);
            }catch(err){
                console.log(err)
            }
            }
        FetchBank();
    },[id])   
  
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", {}, {
        withCredentials: true // allows cookie manipulation
      });

      // Clear any local storage if you use it 
      localStorage.removeItem("user");
      navigate("/login");
      
    } catch (err) {
      console.log("Logout failed:");
    }
  }
    
  const bankInfo = {
    currency: "Gold",
    vaultStatus: "Secure",
    postFee: "-50 G"
  };

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px]">
      
      {/* HEADER: Mahogany Banner (Semi-Transparent) */}
      <header className="sticky top-0 z-20 flex items-center justify-between bg-[#5d4037]/90 backdrop-blur-md border-b-8 border-[#3e2723] px-10 py-6 shadow-2xl">
        <div className="flex items-center space-x-6">
            {/* The Avatar Circle */}
            <a 
            className="h-14 w-14 overflow-hidden rounded-full border-4 border-[#d7ccc8] bg-[#8d6e63] flex items-center justify-center text-[#f5f5f5] shadow-inner hover:scale-[1.02] active:translate-y-1"
            href={profilelink}
            >
              {isLoggedIn && link ? (
                <img 
                  src={link}
                  alt={username}
                  className="h-full w-full object-cover" 
                />
              ) : (
                <User size={32} /> 
              )}
            </a>
            {/* The Username Section */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[#d7ccc8] opacity-70">Adventurer Rank</p>
            <span className="font-bold text-[#f5f5f5] text-xl tracking-wide">
              {isLoggedIn ? username : "Guest_Traveler"}
            </span>
          </div>
        </div>

        <div className="text-center absolute left-1/2 -translate-x-1/2 text-[#d7ccc8]">
          <h1 className="text-5xl font-black uppercase tracking-[0.2em] drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            The Guild Board
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={ isLoggedIn ? handleLogout :handleLoginClick}
            className="flex items-center space-x-2 rounded bg-[#a1887f] px-6 py-2 font-bold text-[#3e2723] hover:scale-105 transition-transform border-b-4 border-[#3e2723]"
          >
            {isLoggedIn ? <><LogOut size={20} /><span>Sign Out</span></> : <><LogIn size={20} /><span>Sign In</span></>}
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex max-w-[1600px] mx-auto p-10 gap-10">
        
        {/* LEFT COLUMN */}
        <aside className="w-80 space-y-6 sticky top-32 h-fit">

          {/* BANK INFO ELEMENT (CLICKABLE) */}
          <button 
            onClick={handleBank}
            className="w-full text-left group relative bg-[#fdf6e3]/90 backdrop-blur-sm p-5 rounded border-2 border-[#b8860b] shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.02] active:translate-y-1"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
          >
            <div className="absolute -top-3 -right-3 bg-[#b8860b] text-white p-2 rounded-full shadow-lg group-hover:rotate-12 transition-transform">
              <Landmark size={20} />
            </div>
            
            <h3 className="font-black uppercase text-[#3e2723] text-xs tracking-widest mb-3 opacity-70 flex items-center gap-2">
              <Wallet size={14} /> Guild Treasury
            </h3>
            
            <div className="flex items-end justify-between border-b border-[#d7ccc8] pb-2 mb-2">
              <span className="text-3xl font-black text-[#5d4037]">{bank.gold}</span>
              <span className="text-[10px] font-bold uppercase text-[#8d6e63] mb-1">{ "gold"/*bankInfo.currency*/}</span>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
              <span className="text-[#8d6e63]">Status: <span className="text-green-700">{bankInfo.vaultStatus}</span></span>
              <span className="text-[#8b0000] opacity-60 italic">{bankInfo.postFee}</span>
            </div>
          </button>
          {/* BLACKSMITH NAV (Added Section) */}
          <nav className="bg-[#efebe9]/80 backdrop-blur-sm p-6 rounded shadow-lg border-2 border-[#8d6e63] space-y-4">
            <h3 className="font-bold uppercase text-[#3e2723] text-xs opacity-60 tracking-widest flex items-center gap-2">
              <Hammer size={14} /> Equipment
            </h3>
            
            <div className="space-y-3">
              <a 
                href="/blacksmith" 
                className="flex items-center justify-between group bg-[#d7ccc8]/40 p-4 rounded border border-[#8d6e63]/30 hover:bg-[#3e2723] hover:text-white transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#5d4037] rounded shadow-inner text-[#f5f5dc] group-hover:bg-[#a1887f] transition-colors">
                    <Anvil size={20} />
                  </div>
                  <div>
                    <p className="font-black uppercase text-sm tracking-tight leading-none">The Iron Forge</p>
                    <p className="text-[10px] uppercase opacity-60 group-hover:text-[#d7ccc8]">Blacksmith Services</p>
                  </div>
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
          </nav>

          {/* SEARCH (Semi-Transparent) */}
          <div className="bg-[#efebe9]/80 backdrop-blur-sm p-6 rounded shadow-lg border-2 border-[#8d6e63] relative">
            <div className="absolute -top-3 -left-3 bg-[#5d4037] text-white p-2 rounded shadow-md">
              <Search size={20} />
            </div>
            <h3 className="font-bold uppercase mb-4 text-[#3e2723] border-b border-[#d7ccc8] pb-2 text-sm tracking-widest">Search Scrolls</h3>
            <form onSubmit={(e) => {
                e.preventDefault(); // Prevents the page from refreshing
                handleSearch();
              }}>
                <input
                  type="text"
                  name="tag"
                  className="w-full bg-transparent border-b-2 border-[#8d6e63] focus:outline-none italic text-[#5d4037] placeholder-[#8d6e63]/60"
                  placeholder="CN230..."
                  onChange={handleChange}
                />
                {/* Optional: A hidden submit button to satisfy form requirements */}
                <button type="submit" className="hidden" />
              </form>
          </div>

          {/* MANAGEMENT NAV (Semi-Transparent) */}
          <nav className="bg-[#f5f5dc]/80 backdrop-blur-sm p-6 rounded shadow-lg border-2 border-[#8d6e63] space-y-4">
            <h3 className="font-bold uppercase text-[#3e2723] text-xs opacity-60 tracking-widest">Guild Parties</h3>
            
            <div className="space-y-3">
              {partys.map((party) => {
                // 1. Determine if the party is active
                const isActive = party.status === "ACTIVE";

                return (
                  <a
                    key={party.postid}
                    href={`/party/${party.postid}`} 
                    className={`flex items-center justify-between group p-3 rounded border transition-all duration-200 
                      ${isActive 
                        ? "bg-[#d7ccc8]/40 border-[#8d6e63]/30 hover:bg-[#5d4037] hover:text-white" 
                        : "bg-gray-200/50 border-gray-400/30 grayscale opacity-60"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={18} className={`opacity-70 ${isActive ? "group-hover:opacity-100" : ""}`} />
                      <div>
                        <p className="font-black uppercase text-sm tracking-tight leading-none">
                          {party.partyname}
                        </p>
                        <p className={`text-[10px] uppercase opacity-60 ${isActive ? "group-hover:text-[#d7ccc8]" : "text-gray-500"}`}>
                          {party.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-inner transition-colors
                        ${isActive 
                          ? "bg-[#8d6e63]/80 group-hover:bg-[#a1887f] text-white" 
                          : "bg-gray-400 text-gray-200"
                        }`}>
                        {`${party.num}/${party.max}`}
                      </span>
                      {isActive && (
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      )}
                    </div>
                  </a>
                );
              })}
            </div>

            <hr className="border-[#d7ccc8]/50 my-4" />

            <div>
              <button className="w-full flex items-center justify-center gap-2 bg-[#8d6e63]/90 py-4 rounded text-[#f5f5dc] font-black uppercase tracking-tighter hover:bg-[#3e2723] transition-all shadow-md border-b-4 border-[#3e2723] active:border-b-0 active:translate-y-1 backdrop-blur-sm" 
                onClick={handlePostClick}>
                <PlusCircle size={20} />
                Post a Bounty
              </button>
            </div>
          </nav>
        </aside>

                  {/* RIGHT COLUMN: The Board Grid */}
          <main className="flex-1">
            {/* Reduced gap from 8 to 4 for a denser board feel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {posts.map((quest) => (
                <div 
                  key={quest.postid} 
                  className="group relative p-5 shadow-[8px_8px_15px_rgba(0,0,0,0.3)] hover:shadow-[12px_12px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-1 rounded-sm border border-white/10 flex flex-col"
                  style={{ 
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                    backgroundColor: 'rgba(253, 246, 227, 0.9)', 
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {/* The Wax Seal/Pin */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-800/90 rounded-full shadow-inner border-2 border-red-950 z-10"></div>
                  
                  {/* Small background insignia */}
                  <div className="absolute -right-2 -top-2 opacity-5 text-[#3e2723]">
                    <Shield size={100} />
                  </div>

                  {/* TOP BAR: Tighter margins and smaller text */}
                  <div className="flex justify-between items-center mb-3 border-b border-dashed border-[#d7ccc8] pb-2">
                    <span className="text-[17px] font-black bg-[#5d4037] text-[#f5f5f5] px-2 py-0.5 rounded tracking-tighter uppercase">
                      {quest.tag}
                    </span>
                    <span className="text-lg font-black text-[#5d4037]">
                      {quest.reward}
                    </span>
                  </div>

                  {/* HEADER: Reduced size and min-height */}
                  <h2 className="mb-1 text-lg font-extrabold text-[#3e2723] leading-tight uppercase min-h-[2.5rem] line-clamp-2">
                    {quest.header}
                  </h2>

                  {/* DESCRIPTION: Smaller text and tighter leading */}
                  <p className="mb-3 text-sm font-medium text-[#5d4037] leading-snug min-h-[3rem] line-clamp-3">
                    {quest.desc}
                  </p>

                  {/* CLIENT: Reduced margin */}
                  <p className="text-[11px] italic text-[#6d4c41] mb-4 mt-auto">
                    Client: <span className="font-bold not-italic text-[#3e2723] underline decoration-wavy">{quest.username}</span>
                  </p>

                  {/* BUTTONS: More compact padding */}
                  <div className="flex flex-col space-y-1.5">
                    <button className="w-full bg-[#5d4037] py-2 text-xs font-bold text-[#f5f5f5] hover:bg-[#3e2723] shadow-md active:translate-y-0.5 transition-all"
                      onClick={() => handleDetail(quest.postid)}
                    >
                      ACCEPT CONTRACT
                    </button>
                    <button className="w-full border border-[#5d4037]/50 py-1.5 text-[10px] font-bold text-[#5d4037] hover:bg-white/30 transition-all"
                      onClick={() => handleDetail(quest.postid)}
                    >
                      DETAILS
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://images.alphacoders.com/110/1105802.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #1a0f0a; /* Fallback */
        }
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: rgba(61, 43, 31, 0.5); }
        ::-webkit-scrollbar-thumb { background: #5d4037; border: 3px solid transparent; background-clip: padding-box; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default WoodQuestBoard;
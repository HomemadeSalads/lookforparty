import React, { useContext, useEffect, useState } from 'react';
import { Shield, LogOut, Flag, ChevronLeft, MessageSquare, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PartyManagement = () => {
  const { currentUser } = useContext(AuthContext);
  const { id } = currentUser;
  //usual navigate function
  const navigate = useNavigate();
  const handleBackClick = e =>{
        navigate("/");
  }

  // Get the pathname: "/party/18"
  const path = window.location.pathname; 
  // Split by "/" and get the last item
  const segments = path.split('/');
  const postid = segments.pop() || segments.pop(); 

  const handleSignup = async (e) =>{
    e.preventDefault();
    try{
      await axios.post(`http://localhost:8800/api/posts/signupParty/${postid}`,{
        id:id
      })
      navigate("/");
    } catch (err){
        console.log(err);
    }
  }

  const handleLeave = async (e) =>{
    e.preventDefault();
    try{
      await axios.post(`http://localhost:8800/api/posts/leaveParty/${postid}`,{
        id:id
      })
      navigate("/");
    } catch (err){
        console.log(err);
    }
  }

  // Getting party info
  const [partyInfo, setPartyInfo] = useState({
    leader: null, 
    partyname: null, 
    header: null, 
    desc: null, 
    contact: null
  });

  const [isActive,setStatus] = useState(true);
  const [members,setMembers] = useState([]);
  const [isMember,checkMembers] = useState(false);
  const [notFull,checkNotFull] = useState(true);
  // get post that are not posted by user or member of
  useEffect(()=>{
    const FetchAllMember = async ()=>{
      try{
          const res = await axios.get(`http://localhost:8800/api/posts/getMember/${postid}`)
          // get id that are in the party
          const ids = res.data.map(item => item.id);
          // check if the user id are in this party and set its to isMember
          checkMembers(ids.includes(id))
          //console.log(res.data)
          setMembers(res.data);
          }catch(err){
            console.log(err)
          }
        }
    const FetchPartyInfo = async ()=>{
      try{
          const res = await axios.get(`http://localhost:8800/api/posts/getThisParty/${postid}`)

          // check if party still active
          setStatus(res.data[0].status === "ACTIVE")
          // check if party is not full
          checkNotFull(res.data[0].member <= res.data[0].max)
          
          //console.log(res.data[0])
          setPartyInfo(res.data[0]);
          }catch(err){
            console.log(err)
          }
        }
    
    FetchAllMember()
    FetchPartyInfo()

  },[postid, id])

  const handleSubmitResult = e =>{
        navigate(`/submitResult/${postid}`);
  }
  
  

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* BACK BUTTON */}
      <button className="mb-6 flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest"
        onClick={handleBackClick}
        >
        <ChevronLeft size={20} />
        Return to Board
      </button>

      {/* MAIN CONTAINER: Semi-Transparent Scroll */}
      <div 
        className="max-w-5xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
          backgroundColor: 'rgba(253, 246, 227, 0.9)',
          backdropFilter: 'blur(8px)'
        }}
      >
    {/* TOP DECORATIVE BAR */}
    <div className="h-4 bg-[#3e2723] w-full" />
        
      {/* PARTY HEADER */}
      <header className="p-8 lg:p-12 border-b-2 border-dashed border-[#d7ccc8] text-center relative">
        <div className="absolute top-4 right-8 opacity-10 rotate-12">
          <Shield size={120} />
        </div>

        <h1 className="text-5xl font-black text-[#3e2723] uppercase tracking-tighter mb-4 drop-shadow-sm">
          {partyInfo.partyname}
        </h1>
        
        <div className="max-w-5x5 mx-auto">
          <h1 className="text-5x5 uppercase tracking-relaxed text-[#8d6e63] font-bold mb-2 italic">{partyInfo.header}</h1>
          <p className="text-lg text-[#5d4037] leading-relaxed italic font-medium mb-6">
            "{partyInfo.desc}"
          </p>

        {/* TOGGLEABLE CONTACT INFO */}
        {isMember && (
          <div className="mt-6 pt-6 border-t border-[#d7ccc8] animate-in fade-in slide-in-from-top-2 duration-500">
            <p className="text-xs uppercase tracking-[0.2em] text-[#8d6e63] font-bold mb-3">Party Communications</p>
            <div className="flex flex-wrap justify-center gap-6 text-[#3e2723]">
              <div className="flex items-center gap-2 bg-[#efebe9]/50 px-4 py-2 rounded-sm border border-[#8d6e63]/20">
                <MessageSquare size={16} className="text-[#8d6e63]" />
                <span className="text-sm font-bold">{partyInfo.contact || 'Party Discord'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>

        {/* PARTY MEMBERS GRID */}
        <div className="p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => {
            // use leader id to check if match with any partymember id
            const isLeader = partyInfo.leader === member.id;
            return (
              <a 
                key={member.id}
                className={`relative group transition-all duration-300 hover:-translate-y-1 p-6 border-2 
                  ${isLeader ? 'border-[#b8860b] bg-[#fff9e6]/50' : 'border-[#8d6e63]/30 bg-[#efebe9]/30'}
                  shadow-lg rounded-sm cursor-pointer`}
                  href={`/profile/${member.id}`}
              >
                {/* LEADER FLAG */}
                {isLeader && (
                  <div className="absolute -top-3 -left-3 bg-[#b8860b] text-white p-2 shadow-md rounded-sm animate-pulse">
                    <Flag size={18} fill="currentColor" />
                  </div>
                )}

                <div className={`w-24 h-24 mx-auto mb-4 rounded-full border-4 flex items-center justify-center text-3xl font-black shadow-inner overflow-hidden
                  ${isLeader ? 'border-[#b8860b] bg-[#5d4037] text-[#d7ccc8]' : 'border-[#8d6e63] bg-[#8d6e63]/20 text-[#5d4037]'}`}>
                    {member.link?.startsWith('http') ? (
                      <img 
                        src={member.link} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      // Fallback to text (like initials) if there is no image URL
                      <span>{member.link}</span>
                    )}
                </div>

                <div className="text-center">
                  <h3 className="font-black uppercase text-[#3e2723] truncate leading-none mb-1">
                    {member.username}
                  </h3>
                  <p className="text-xs font-bold text-[#8d6e63] uppercase tracking-widest mb-3">
                    {member.class}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 border-t border-[#d7ccc8] pt-3 mt-auto">
                    <div className="text-center">
                      <p className="text-[10px] uppercase opacity-60 font-bold leading-none">GEAR SCORE</p>
                      <p className="font-black text-lg text-[#3e2723]">{member.score}</p>
                    </div>
                    <div className="h-8 w-px bg-[#d7ccc8]" />
                    <div className="text-center">
                      <p className="text-[10px] uppercase opacity-60 font-bold leading-none">Role</p>
                      <p className="font-black text-sm text-[#3e2723] uppercase">
                        {isLeader ? 'Leader' : 'Ally'}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* FOOTER ACTIONS: Toggle Join/Abandon */}
      <footer className="p-8 bg-[#3e2723]/5 flex justify-center border-t-2 border-[#d7ccc8]/30">
        {isActive ? isMember ? partyInfo.leader === id ? (
          <button className="flex items-center gap-3 px-10 py-4 bg-[#8b0000] text-[#f5f5dc] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(139,0,0,0.3)] hover:bg-[#a50000] hover:scale-105 active:translate-y-1 transition-all border-b-4 border-[#4a0000]"
            onClick={handleSubmitResult}
          >
            <LogOut size={20} />
            Submit Result
          </button>
        ) : (
          <button className="flex items-center gap-3 px-10 py-4 bg-[#8b0000] text-[#f5f5dc] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(139,0,0,0.3)] hover:bg-[#a50000] hover:scale-105 active:translate-y-1 transition-all border-b-4 border-[#4a0000]"
            onClick={handleLeave}
          >
            <LogOut size={20} />
            Abandon Party
          </button>
        ) : (
          <button className="flex items-center gap-3 px-10 py-4 bg-[#2e7d32] text-[#f5f5dc] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(46,125,50,0.3)] hover:bg-[#388e3c] hover:scale-105 active:translate-y-1 transition-all border-b-4 border-[#1b5e20]"
            onClick={ notFull ? handleSignup : handleBackClick}
          >
            <UserPlus size={20} />
            Join Adventure
          </button>
        ): (<></>)} 
      </footer>

        {/* BOTTOM DECORATIVE BAR */}
        <div className="h-4 bg-[#3e2723] w-full" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://i.redd.it/ecly828dffd21.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}} />
    </div>
  );
};

export default PartyManagement;
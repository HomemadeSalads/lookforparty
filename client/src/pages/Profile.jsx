import React, { useContext, useEffect, useState } from 'react';
import { User, Users, Shield, Coins, Edit3, ChevronLeft, Award, RefreshCw, SwatchBook, ChevronRight, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const PlayerProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = currentUser;
    const changeCost = 50; // Cost in gold to change info

    const navigate = useNavigate();
    const handleBackClick = e =>{
        navigate("/");
    }

    // Get the pathname: "/party/18"
    const path = window.location.pathname; 
    // Split by "/" and get the last item
    const segments = path.split('/');
    const profileid = segments.pop() || segments.pop();

    
    const [isOwner, setOwner] = useState(false);
    // Profile State
    const [profile, setProfile] = useState({});
    useEffect(()=>{
        const FetchProfile = async ()=>{
        try{
            const res = await axios.get(`http://localhost:8800/api/user/getUser/${profileid}`)
            // get id of this profile
            const ids = res.data[0].id
            // check if the user id is then isOwner is true
            setOwner(ids === id)

            setProfile(res.data[0]);
            }catch(err){
                console.log(err)
            }
            }
        FetchProfile();
    },[id,profileid])    
    
    // getting party that you are in
    const [partys,setParty] = useState([]);
    useEffect(()=>{
          const FetchAllParty = async ()=>{
              try{
                  const res = await axios.post("http://localhost:8800/api/posts/getParty",{
                    id:profileid
                  })
                  setParty(res.data);
              }catch(err){
                  console.log(err)
              }
          }
          FetchAllParty()
      },[profileid])
      //console.log(posts)

    // handle text box to update info of user
    const [changedClass, setClass] = useState({
        class:null
    });
    const handleChangedClass = (e) =>{
          setClass(prev=>({...prev, [e.target.name]: e.target.value }));
    };

    const [changedPic, setPic] = useState({
        picId:null
    });
    const handleChangedPic = (e) =>{
          setPic(prev=>({...prev, [e.target.name]: e.target.value }));
    };

    const handleClickedChangeClass = async (e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:8800/api/user/changeClass",{
                class : changedClass.class,
                id : id
            })
            window.location.reload();
        } catch(err){
            console.log("error at changeclass")
        }
    }

    const handleClickedChangePic = async (e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:8800/api/user/changePicId",{
                picId : changedPic.picId,
                id : id
            })
            window.location.reload();
        } catch(err){
            console.log("error")
        }
    }


  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* NAVIGATION & GOLD HUD */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <button className="flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest group"
            onClick={handleBackClick}
            >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Board
        </button>
        {isOwner ? (
        <div className="bg-[#fdf6e3] border-2 border-[#b8860b] px-6 py-2 rounded shadow-lg flex items-center gap-3">
          <Coins className="text-[#b8860b]" size={20} />
          <span className="text-sm font-black uppercase text-[#8d6e63]">Treasury:</span>
          <span className="text-xl font-black text-[#3e2723]">{profile.gold} G</span>
        </div>) : (<></>)}
      </div>

      {/* PROFILE SCROLL */}
      <div 
        className="max-w-2xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-x-8 border-[#3e2723] relative overflow-hidden"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
          backgroundColor: 'rgba(253, 246, 227, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* HEADER DECOR */}
        <div className="h-4 bg-[#3e2723] w-full mb-8" />

        <div className="px-8 lg:px-16 pb-12 space-y-10">
          
          {/* TOP SECTION: AVATAR & UNEDITABLE INFO */}
          <section className="text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-[#3e2723] rounded-full border-4 border-[#b8860b] shadow-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={profile.link}
                  alt={profile.username}
                  className="h-full w-full object-cover" 
                />
                <User size={64} className="text-[#d7ccc8]" />
              </div>
              {/*<div className="absolute -bottom-2 right-0 bg-[#b8860b] p-1.5 rounded-full border-2 border-[#fdf6e3] shadow-md">
                {/*<Lock size={14} className="text-white" title="Fixed Identity" />*/}
              {/*</div>*/}
            </div>

            <div>
              <h1 className="text-4xl font-black text-[#3e2723] uppercase tracking-tighter">{profile.username}</h1>
              <div className="flex justify-center items-center gap-3 mt-1 text-[#8d6e63]">
                <Award size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">{profile.class}</span>
              </div>
            </div>

            {/* GEAR SCORE DISPLAY */}
            <div className="bg-[#3e2723]/5 border-2 border-dashed border-[#d7ccc8] p-4 rounded-sm">
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Combat Readiness (GearScore)</p>
              <div className="flex justify-center items-center gap-2">
                <Shield size={20} className="text-[#5d4037]" />
                <span className="text-3xl font-black text-[#5d4037]">{profile.score}</span>
              </div>
            </div>
          </section>

        {isOwner ? (
  <section className="space-y-10 border-t-2 border-[#d7ccc8] pt-8">
    {/* CHANGEABLE PLAYER CLASS */}
    <div className="group space-y-3">
      <div className="flex justify-between items-end">
        <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
          <SwatchBook size={16} /> Adventurer Class
        </label>
        <span className="text-[10px] font-bold text-[#b8860b] italic">
          Cost: {changeCost} G
        </span>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            name='class'
            onChange={handleChangedClass}
            placeholder="Enter new class..."
            className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-xl focus:outline-none focus:border-[#b8860b] transition-colors italic font-bold text-[#3e2723] placeholder-[#8d6e63]/30"
          />
          <Edit3 size={16} className="absolute right-0 bottom-3 text-[#8d6e63] opacity-40" />
        </div>
        <button className="bg-[#5d4037] px-6 py-2 text-[#f5f5dc] text-xs font-black uppercase tracking-widest shadow-md hover:bg-[#3e2723] transition-all active:translate-y-0.5 border-b-2 border-[#241715]"
            onClick={handleClickedChangeClass}
        >
          Seal
        </button>
      </div>
    </div>

    {/* CHANGEABLE PROFILE PICTURE ID */}
    <div className="group space-y-3">
      <div className="flex justify-between items-end">
        <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
          <RefreshCw size={16} /> Profile Picture Id
        </label>
        <span className="text-[10px] font-bold text-[#b8860b] italic">
          Cost: {changeCost} G
        </span>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="number"
            name='picId'
            onChange={handleChangedPic}
            placeholder="ID #"
            className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-xl focus:outline-none focus:border-[#b8860b] transition-colors font-mono font-bold text-[#3e2723] placeholder-[#8d6e63]/30"
          />
          <Edit3 size={16} className="absolute right-0 bottom-3 text-[#8d6e63] opacity-40" />
        </div>
        <button className="bg-[#5d4037] px-6 py-2 text-[#f5f5dc] text-xs font-black uppercase tracking-widest shadow-md hover:bg-[#3e2723] transition-all active:translate-y-0.5 border-b-2 border-[#241715]"
            onClick={handleClickedChangePic}
        >
          Seal
        </button>
      </div>
    </div>
    
    <p className="text-center text-[10px] mt-6 opacity-50 italic">
      *Each record entry requires a separate guild seal and fee.
    </p>
  </section>
) : (
  /* NON-OWNER VIEW: MEMBER OF SECTION */
  <div className="space-y-5 border-t-2 border-[#d7ccc8] pt-8">
    <div className="flex items-center gap-2 text-[#3e2723]">
      <span className="text-xs font-bold uppercase tracking-widest opacity-60">
        MEMBER OF
      </span>
      <Flag size={15} className="opacity-60" />
    </div>
    <div className="space-y-3">
      {partys.map((party) => (
        <a
          key={party.postid}
          href={`/party/${party.postid}`}
          className="flex items-center justify-between group bg-[#d7ccc8]/40 p-4 rounded border border-[#8d6e63]/30 hover:bg-[#5d4037] hover:text-white transition-all duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Users size={18} className="opacity-70 group-hover:opacity-100" />
            <div>
              <p className="font-black uppercase text-sm tracking-tight leading-none">
                {party.partyname}
              </p>
              <p className="text-[10px] uppercase opacity-60 group-hover:text-[#d7ccc8] mt-1">
                Active Duty
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-[#8d6e63]/80 group-hover:bg-[#a1887f] text-white px-2 py-0.5 rounded shadow-inner transition-colors">
              {`${party.num}/${party.max}`}
            </span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
                </a>
            ))}
            </div>
        </div>
        )}

          {/* SAVE BUTTON (Legacy Code for both submitting bad idea)*/}
        {false ? (
        <div className="pt-4">
            <button className="w-full bg-[#5d4037] py-4 text-[#f5f5dc] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#3e2723] transition-all hover:scale-[1.02] active:translate-y-1 border-b-4 border-[#241715]">
              Update Scroll Records
            </button>
            <p className="text-center text-[10px] mt-4 opacity-50 italic">
              *Guild records are immutable once sealed for the day.
            </p>
        </div>
        ) : (<></>)}
        </div>

        <div className="h-4 bg-[#3e2723] w-full mt-4" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://images.alphacoders.com/110/1105802.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-position: center;
        }
        /* Hide arrows for number input */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}} />
    </div>
  );
};

export default PlayerProfile;
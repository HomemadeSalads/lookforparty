import React, { useContext, useEffect, useState } from 'react';
import { FileCheck, Shield, ChevronLeft, Flag, PenTool, AlertCircle } from 'lucide-react';
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmitResult = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = currentUser;
    
    // Get the pathname: "/party/postid"
    const path = window.location.pathname; 
    // Split by "/" and get the last item
    const segments = path.split('/');
    const postid = segments.pop() || segments.pop(); 

    //usual navigate function
    const navigate = useNavigate();
    const handleBackClick = e =>{
        navigate(`/party/${postid}`);
    }

    const [partyInfo,setPartyInfo] = useState({});
    const [isLeader,checkLeader] = useState(false);
    const [memberids,setMemberid] = useState([]);

    // get post that are not posted by user or member of
    useEffect(()=>{
        const FetchAllMember = async ()=>{
          try{
              const res = await axios.get(`http://localhost:8800/api/posts/getMember/${postid}`)
              // get id that are in the party
              const ids = res.data.map(item => item.id);
              // get id that are not the leader one
              setMemberid(ids.filter(item => item !== id))
              }catch(err){
                console.log(err)
              }
            }

        const FetchPartyInfo = async ()=>{
        try{
            const res = await axios.get(`http://localhost:8800/api/posts/getThisParty/${postid}`)
            console.log(res.data[0])

            // denied accessability to anyone that is't leader
            checkLeader(id === res.data[0].leader)
            setPartyInfo(res.data[0]);
            }catch(err){
                console.log(err)
            }
            }

        FetchPartyInfo()
        FetchAllMember()
        console.log(partyInfo.reward / memberids.length)
    },[postid, id ,partyInfo, memberids])

    // handle text change in textbox
    const [inputs, setInputs] = useState({
        postid:postid,
        detail:""
    });
    const handleChange = (e) =>{
        setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
    };

    // handle submitting a form
    const handleSubmit = async (e) =>{
      e.preventDefault();
      try{
        await axios.post("http://localhost:8800/api/posts/submitResult",inputs)

        // for every member
        for (const memberid of memberids) {
          await axios.post("http://localhost:8800/api/user/addGold",{
            id:memberid,
            amount: (partyInfo.reward / memberids.length)
          })
        }

        navigate(`/party/${postid}`);
      } catch (err){
          console.log("error");
      }
  }

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* NAVIGATION */}
      <button className="mb-8 flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest group"
        onClick={handleBackClick}
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Return to Party Hall
      </button>

      <div className="max-w-4xl mx-auto">
        
        {/* THE MISSION REPORT SCROLL */}
        <div 
          className="relative shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-x-[12px] border-[#3e2723] overflow-hidden"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            backgroundColor: 'rgba(253, 246, 227, 0.96)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* HEADER SECTION */}
          <header className="p-10 lg:p-14 border-b-4 border-double border-[#d7ccc8] text-center relative">
            <div className="absolute top-6 left-10 opacity-10">
              <Shield size={100} />
            </div>
            
            <div className="inline-flex items-center gap-3 bg-[#3e2723] text-[#f5f5dc] px-4 py-1 mb-6 rounded-sm shadow-md">
              <Flag size={14} className="text-[#b8860b]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Official Completion Form</span>
            </div>

            <h1 className="text-5xl font-black text-[#3e2723] uppercase tracking-tighter mb-2">
              {partyInfo.header}
            </h1>
            <p className="text-lg text-[#8d6e63] font-bold italic border-t border-[#d7ccc8] pt-2 inline-block">
              Contract: {partyInfo.desc}
            </p>
          </header>

          {/* MAIN INPUT AREA */}
          <main className="p-10 lg:p-14 space-y-8">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037] tracking-widest">
                  <PenTool size={18} /> Field Report & Proof of Completion
                </label>
                <span className="text-[10px] font-bold text-[#8d6e63] opacity-60 uppercase italic">
                  *Describe the outcome and provide links to evidence
                </span>
              </div>

              <div className="relative group">
                {/* Textarea styled as lined parchment paper */}
                <textarea 
                  rows="12"
                  name='detail'
                  onChange={handleChange}
                  placeholder="The beast has been felled at the crossroads... We found the following evidence..."
                  className="w-full bg-[#3e2723]/5 border-2 border-[#8d6e63]/30 p-8 text-xl focus:outline-none focus:border-[#3e2723] transition-all italic leading-relaxed text-[#3e2723] placeholder-[#8d6e63]/30 rounded-sm shadow-inner"
                  style={{ 
                    backgroundImage: 'linear-gradient(#8d6e63 1px, transparent 1px)',
                    backgroundSize: '100% 2.5rem',
                    lineHeight: '2.5rem'
                  }}
                />
              </div>
            </div>

            {/* VERIFICATION WARNING */}
            <div className="bg-[#8b0000]/5 border-l-4 border-[#8b0000] p-5 flex gap-4 items-start shadow-sm">
              <AlertCircle className="text-[#8b0000] shrink-0" size={20} />
              <div>
                <p className="text-xs uppercase font-black text-[#8b0000] mb-1">Guild Law: False Reports</p>
                <p className="text-[11px] font-bold text-[#8b0000]/80 leading-tight uppercase tracking-tight">
                  Providing false proof of completion results in immediate party disbandment, seizure of all gold, and a global bounty on all party members. 
                </p>
              </div>
            </div>

            {/* SUBMIT ACTION */}
            {isLeader ? (
            <div className="pt-6">
              <button 
                type="button"
                className="w-full group bg-[#2e4d2e] py-6 text-[#f5f5dc] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-[#1e3d1e] transition-all hover:scale-[1.01] active:translate-y-1 border-b-8 border-[#142614] flex items-center justify-center gap-4"
                onClick={handleSubmit}
              >
                <FileCheck size={28} className="group-hover:rotate-12 transition-transform" />
                Submit for Verification
              </button>
              <p className="text-center text-[10px] mt-6 text-[#8d6e63] font-bold uppercase tracking-widest opacity-60">
                Sealed by the hand of {'partyleader'}
              </p>
            </div>) : (<></>)}
          </main>

          {/* DECORATIVE FOOTER BAR */}
          <div className="h-4 bg-[#3e2723] w-full" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://images.alphacoders.com/110/1105802.jpg');
          background-size: cover;
          background-attachment: fixed;
        }
        textarea::placeholder {
          opacity: 0.2;
        }
      `}} />
    </div>
  );
};

export default SubmitResult;
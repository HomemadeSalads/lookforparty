import React, { useContext, useState } from 'react';
import { Scroll, Coins, MessageSquare, Users, Shield, Tag, Type, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const PostBounty = () => {
    const { currentUser } = useContext(AuthContext);
    const { id } = currentUser;

    const [post,setPost] = useState({
        id: id,
        header:"",
        partyname:"",
        desc:"",
        reward:0,
        max:0,
        tag:"",
        contact:""
    });

    const handleChange = (e)  =>{
        setPost((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }
    const handleClick = async e =>{
        e.preventDefault()
        try{
            // this send object book that have stored value to the backend
            await axios.post("http://localhost:8800/api/posts/postBounty",post)
            // after the click go back to home page
            await axios.post("http://localhost:8800/api/user/deductGold",{
              id:id,
              amount:(parseInt(post.reward) + 50)
            })

            navigate("/")
        }catch(err){
            console.log(err)
        }
    }

    const navigate = useNavigate();
    const handleBackClick = e =>{
        navigate("/");
    }

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* BACK BUTTON */}
      <button className="mb-6 flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest" onClick={handleBackClick}>
        <ChevronLeft size={20} />
        Return to Board
      </button>

      {/* MAIN FORM CONTAINER: The "Blank Scroll" */}
      <div 
        className="max-w-3xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden"
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
          backgroundColor: 'rgba(253, 246, 227, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* WAX SEAL DECORATION */}
        <div className="absolute top-6 right-8 w-16 h-16 bg-[#8b0000] rounded-full shadow-inner border-4 border-[#4a0000] flex items-center justify-center opacity-80 rotate-12 z-10">
          <Scroll className="text-[#f5f5dc]/50" size={30} />
        </div>

        <div className="h-3 bg-[#5d4037] w-full" />

        <header className="p-8 border-b-2 border-dashed border-[#d7ccc8] text-center">
          <h1 className="text-4xl font-black text-[#3e2723] uppercase tracking-tighter">Draft New Contract</h1>
          <p className="text-xs font-bold text-[#8d6e63] uppercase tracking-[0.2em] mt-2">Bounties must be verified by the Guild Master</p>
        </header>

        <form className="p-8 lg:p-12 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CONTRACT HEADING */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                  <Type size={16} /> Contract Heading
                </label>
                <input 
                  type="text"
                  placeholder="e.g., Slime Infestation"
                  className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-xl focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40 font-bold"
                  onChange={handleChange}
                  name='header'
                />
              </div>

              {/* PARTY NAME */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                  <Shield size={16} /> Party / Guild Name
                </label>
                <input 
                  type="text"
                  placeholder="e.g., The Silver Hand"
                  className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-xl focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40 font-bold"
                  onChange={handleChange}
                  name='partyname'
                />
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* TAGS */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                <Tag size={16} /> Classification
              </label>
              <input 
                type="text"
                placeholder="Beast, Stealth..."
                className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40"
                onChange={handleChange}
                name='tag'
              />
            </div>

            {/* PARTY SIZE */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                <Users size={16} /> Party Size
              </label>
              <input 
                type="number"
                placeholder="e.g., 4"
                className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40 font-bold"
                onChange={handleChange}
                name='max'
              />
            </div>

            {/* REWARD */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                <Coins size={16} /> Bounty Reward
              </label>
              <input 
                type="number"
                placeholder="e.g., 500 Gold"
                className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40 font-black text-[#3e2723]"
                onChange={handleChange}
                name='reward'
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
              <Scroll size={16} /> Mission Description
            </label>
            <textarea 
              rows="5"
              placeholder="Provide details of the threat, location, and specific requirements..."
              className="w-full bg-[#3e2723]/5 border-2 border-[#8d6e63]/30 p-4 rounded-sm focus:outline-none focus:border-[#3e2723] transition-colors italic leading-relaxed"
              onChange={handleChange}
              name='desc'
            ></textarea>
          </div>

          {/* CONTACT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
              <MessageSquare size={16} /> Contact Information
            </label>
            <input 
              type="text"
              placeholder="e.g., Tavern at the Crossroads, ask for 'Old Man Barnaby'"
              className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 focus:outline-none focus:border-[#3e2723] transition-colors placeholder-[#8d6e63]/40"
              onChange={handleChange}
              name='contact'
            />
          </div>

          {/* WARNING BOX */}
          <div className="bg-[#8b0000]/5 border-l-4 border-[#8b0000] p-4 flex gap-4 items-start">
            <AlertCircle className="text-[#8b0000] shrink-0" size={20} />
            <p className="text-[11px] uppercase font-bold text-[#8b0000] leading-tight">
              Fraudulent contracts will result in immediate exile from the Guild and a bounty placed on the author's head. Listing fees are non-refundable.
            </p>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button 
              type="button"
              className="w-full bg-[#5d4037] py-5 text-[#f5f5dc] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl hover:bg-[#3e2723] transition-all hover:scale-[1.01] active:translate-y-1 border-b-4 border-[#241715]"
              onClick={handleClick}
            >
              <CheckCircle size={24} />
              Seal & Post Contract
            </button>
          </div>
        </form>

        <div className="h-3 bg-[#5d4037] w-full" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://1.bp.blogspot.com/-o-RiIKBFMYo/Th3vXgA36KI/AAAAAAAAAL0/FTrA_NQbl4A/w1200-h630-p-k-no-nu/Fantasy-Tavern-low900.jpg');
          background-size:cover;
          background-attachment: fixed;
          background-repeat: no-repeat;
          background-position: center;
        }
        input::placeholder, textarea::placeholder {
          font-style: italic;
          opacity: 0.5;
        }
      `}} />
    </div>
  );
};

export default PostBounty;
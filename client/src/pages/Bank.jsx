import React, { useContext, useEffect, useState } from 'react';
import { Landmark, Coins, ArrowRightLeft, UserCircle2, Search, ShieldCheck, ChevronLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const GuildTreasury = () => {
  // use context of logging in 
  const { currentUser } = useContext(AuthContext);
  const { id } = currentUser;

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

  // back button setup
  const navigate = useNavigate();
  const handleBackClick = e =>{
        navigate("/");
  }

  // setup of textbox
  const [targetId, setTargetId] = useState({id:1});
  const [amount, setAmount] = useState({amount:1});
  const [verifiedName, setVerifiedName] = useState({username:"dandelion"}); 

  // setup of change in textbox
  const handleChangedTargetId = (e) =>{
      setTargetId(prev=>({...prev, [e.target.name]: e.target.value }));
  };
  const handleChangedAmount = (e) =>{
      setAmount(prev=>({...prev, [e.target.name]: e.target.value }));
  };

  // fetch username of recitpion
  const [clickedFetch, setIsFetched] = useState(false);
  
  const FetchUsername = async ()=>{
    try{
        //console.log(targetId.id)
        const res = await axios.post(`http://localhost:8800/api/user/getUsername`,{
          id: targetId.id
        })
        //console.log(res.data)
        setVerifiedName(res.data[0]);
        setIsFetched(true);
        }catch(err){
          console.log(err)
        }
  }

  // handle tranfering of gold
  const handleTranfer = async (e) =>{
    e.preventDefault();
    try{
      await axios.post("http://localhost:8800/api/user/addGold",{
        id:targetId.id,
        amount:amount.amount
      })
      await axios.post("http://localhost:8800/api/user/deductGold",{
        id:id,
        amount:amount.amount
      })
      navigate("/");
    } catch (err){
      console.log("tranfer fail")
    }
  }

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* NAVIGATION */}
      <button className="mb-8 flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest group"
        onClick={handleBackClick}
        >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Return to Board
      </button>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* CURRENT BALANCE HEADER */}
        <section 
          className="relative p-8 border-4 border-[#b8860b] shadow-2xl overflow-hidden rounded-sm"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            backgroundColor: 'rgba(253, 246, 227, 0.95)'
          }}
        >
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
            <Coins size={150} />
          </div>
          
          <div className="flex flex-col items-center text-center space-y-2">
            <Landmark size={32} className="text-[#b8860b]" />
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-[#8d6e63]">Total Gold in Vault</h1>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-[#3e2723] drop-shadow-sm">{bank.gold}</span>
              <span className="text-xl font-bold text-[#b8860b] uppercase">Gold</span>
            </div>
          </div>
        </section>

        {/* TRANSFER FORM: THE LEDGER */}
        <main 
          className="relative shadow-2xl border-x-8 border-[#3e2723] p-10 lg:p-16"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            backgroundColor: 'rgba(253, 246, 227, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="mb-10 text-center border-b-2 border-dashed border-[#d7ccc8] pb-6">
            <h2 className="text-3xl font-black text-[#3e2723] uppercase tracking-tighter">Gold Transfer Ledger</h2>
            <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest mt-1">Funds will be moved immediately upon sealing</p>
          </div>

          <form className="space-y-10">
            
            {/* RECIPIENT ID & CHECK BUTTON */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                <UserCircle2 size={18} /> Recipient Identification (ID)
              </label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    name='id'
                    onChange={handleChangedTargetId}
                    placeholder="Enter Adventurer ID..."
                    className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-xl focus:outline-none focus:border-[#b8860b] transition-colors font-mono font-bold text-[#3e2723] placeholder-[#8d6e63]/30"
                  />
                </div>
                <button 
                  type="button"
                  onClick={FetchUsername}
                  className="flex items-center gap-2 bg-[#8d6e63] px-6 py-2 text-[#f5f5dc] text-xs font-black uppercase tracking-widest shadow-md hover:bg-[#5d4037] transition-all border-b-2 border-[#3e2723]"
                >
                  <Search size={14} /> Verify
                </button>
              </div>
              
              {/* VERIFIED NAME DISPLAY */}
              {clickedFetch && (
                <div className="flex items-center gap-2 text-[#2e4d2e] bg-[#2e4d2e]/5 p-2 rounded animate-fade-in">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest italic">Recipient Found: {verifiedName.username}</span>
                </div>
              )}
            </div>

            {/* AMOUNT TEXTBOX */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase text-[#5d4037]">
                <ArrowRightLeft size={18} /> Amount to Transfer
              </label>
              <div className="relative max-w-[200px]">
                <input 
                  type="number" 
                  name='amount'
                  onChange={handleChangedAmount}
                  placeholder="000"
                  className="w-full bg-transparent border-b-2 border-[#8d6e63] py-2 text-3xl focus:outline-none focus:border-[#b8860b] transition-colors font-black text-[#3e2723] placeholder-[#8d6e63]/20"
                />
              </div>
            </div>

            {/* TAX/WARNING INFO */}
            <div className="bg-[#8b0000]/5 border-l-4 border-[#8b0000] p-4 flex gap-4 items-start">
              <AlertCircle className="text-[#8b0000] shrink-0" size={18} />
              <p className="text-[10px] uppercase font-bold text-[#8b0000] leading-tight">
                Warning: Once the scroll is sealed, the guild cannot retrieve lost gold. Ensure the recipient ID is correct. A 1% processing fee applies.
              </p>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6">
              <button 
                type="button"
                className="w-full bg-[#5d4037] py-5 text-[#f5f5dc] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#3e2723] transition-all hover:scale-[1.01] active:translate-y-1 border-b-4 border-[#241715] flex items-center justify-center gap-3"
                onClick={handleTranfer}
              >
                <Landmark size={20} />
                Authorize Transfer
              </button>
            </div>

          </form>
        </main>
        
        <p className="text-center text-[10px] uppercase font-bold text-[#d7ccc8] tracking-[0.4em] opacity-40">
          Royal Mint Protocol • Securing Adventurer Assets
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://static.wikia.nocookie.net/elryah/images/c/c0/Iron_Bank.jpg');
          background-size: cover;
          background-attachment: fixed;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}} />
    </div>
  );
};

export default GuildTreasury;
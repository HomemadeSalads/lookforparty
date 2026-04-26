import React, { useContext, useEffect, useState } from 'react';
import { 
  Shield, 
  Sword, 
  Scroll, 
  FlaskConical, 
  Book, 
  Coins, 
  ChevronLeft, 
  Hammer, 
  ShoppingBag,
  Flame,
  Swords
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import axios from 'axios';

const BlacksmithShop = () => {
    // use context of logging in 
    const { currentUser } = useContext(AuthContext);                    
    const { id } = currentUser;

    const navigate = useNavigate();
    const handleBackClick = e =>{
        navigate("/");
    }
  
    // get Banking info => gold and gear score
    const [bank, setBank] = useState({});
    const [gear, setGear] = useState({});
    useEffect(()=>{
          const FetchBank = async ()=>{
          try{
              const res = await axios.post(`http://localhost:8800/api/user/getBank`,{
                id:id
              })
              //console.log(res.data)
              setBank(res.data[0]);
              }catch(err){
                  console.log(err)
              }
            }

          const FetchGear = async ()=>{
          try{
              const res = await axios.post(`http://localhost:8800/api/user/getGear`,{
                id:id
              })
              //console.log(res.data)
              setGear(res.data[0]);
              }catch(err){
                  console.log(err)
              }
            }

          FetchBank();
          FetchGear();
    },[id])

    const [items, setItems] = useState([{}]);
    useEffect(()=>{
          const FetchItems = async ()=>{
            try{
                const res = await axios.get(`http://localhost:8800/api/posts/getInventory`)
                console.log(res.data)
                setItems(res.data);
                }catch(err){
                    console.log(err)
                }
              }
    FetchItems()
          
    },[id])
    
    // React Mapping Object
    const ICON_MAP = {
      "Armor": <Shield size={18} />,
      "Magic": <Scroll size={18} />,
      "Weapon": <Sword size={18} />,
      "Alchemy": <FlaskConical />,
      "Knowledge": <Book />
    };

    const handleBuy = async (itemprice, itemscore)=>{
      if (itemprice < bank.gold){
        try{
          await axios.post(`http://localhost:8800/api/user/buyItem`,{
            id:id,
            price:itemprice,
            score:itemscore
          })

          }catch(err){
            console.log(err)
          }

        window.location.reload();
      }
    else {
      window.location.href = "https://www.youtube.com/watch?v=J8XxuW-Orww&t=13s";
    }
      
    }

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* HEADER HUD */}
      <div className="max-w-[1400px] mx-auto flex justify-between items-center mb-10">
        <button className="flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest group"
            onClick={handleBackClick}
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Board
        </button>
        
        {/* WEALTH & POWER STATS */}
        <div className="flex gap-4">
          {/* GEAR SCORE HUB */}
          <div className="bg-[#2c2c2c]/80 backdrop-blur-md border-2 border-[#8d6e63] px-6 py-2 rounded shadow-lg flex items-center gap-3">
            <Swords className="text-[#d7ccc8]" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-[#d7ccc8] leading-none">Gear Score</span>
              <span className="text-xl font-black text-white">{gear.score}</span>
            </div>
          </div>

          {/* TREASURY HUB */}
          <div className="bg-[#fdf6e3] border-2 border-[#b8860b] px-6 py-2 rounded shadow-lg flex items-center gap-3">
            <Coins className="text-[#b8860b]" size={20} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-[#8d6e63] leading-none">Treasury</span>
              <span className="text-xl font-black text-[#3e2723]">{bank.gold} G</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        
        {/* SHOP SIGNBOARD */}
        <section className="text-center mb-12 relative">
          <div className="inline-block relative">
            <Flame className="absolute -top-10 left-1/2 -translate-x-1/2 text-[#8b0000] opacity-50 animate-pulse" size={40} />
            <h1 className="text-6xl font-black text-[#f5f5dc] uppercase tracking-tighter drop-shadow-2xl flex items-center gap-4">
              <Hammer size={48} className="text-[#8d6e63]" />
              The Iron Forge
              <Hammer size={48} className="text-[#8d6e63] -scale-x-100" />
            </h1>
            <p className="text-[#d7ccc8] text-xs uppercase tracking-[0.6em] mt-2 opacity-70">Masters of Steel & Arcane Antiquities</p>
          </div>
        </section>

        {/* INVENTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.itemid}
              onClick={() => handleBuy(item.price, item.score)}
              className="group relative flex flex-col text-left transition-all duration-300 hover:-translate-y-2 active:scale-95"
            >
              {/* The "Item Card" Scroll */}
              <div 
                className="flex-1 p-6 border-x-4 border-t-4 border-[#3e2723]/30 shadow-xl relative overflow-hidden"
                style={{ 
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
                  backgroundColor: 'rgba(253, 246, 227, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Rarity Indicator */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-black uppercase text-white shadow-md
                  ${item.rarity === 'Epic' ? 'bg-[#4b0082]' : item.rarity === 'Rare' ? 'bg-[#00008b]' : 'bg-[#5d4037]'}`}>
                  {item.rarity}
                </div>

                {/* Item Icon */}
                <div className="w-16 h-16 bg-[#3e2723] rounded-sm flex items-center justify-center text-[#d7ccc8] mb-4 shadow-inner border border-[#b8860b]/30 group-hover:scale-110 transition-transform">
                  {ICON_MAP[item.category] || <Scroll size={64} />}
                </div>

                <h3 className="text-xl font-black text-[#3e2723] uppercase tracking-tight leading-tight mb-1 group-hover:text-[#b8860b]">
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest mb-4 italic">
                  {item.category}
                </p>

                <div className="mt-auto pt-4 border-t border-dashed border-[#d7ccc8] flex justify-between items-center">
                   <div className="flex items-center gap-1">
                      <Coins size={14} className="text-[#b8860b]" />
                      <span className="text-xl font-black text-[#3e2723]">{item.price}</span>
                   </div>
                   <div className="text-[10px] font-black uppercase bg-[#8d6e63]/20 px-2 py-1 rounded">
                      Buy Now
                   </div>
                </div>
              </div>
              
              {/* Bottom Decorative Edge */}
              <div className="h-2 bg-[#3e2723] w-full shadow-lg" />
            </button>
          ))}
        </div>

        {/* SHOP FOOTER */}
        <footer className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 bg-[#3e2723]/80 backdrop-blur-md px-10 py-4 rounded-full border-2 border-[#b8860b] shadow-2xl">
            <ShoppingBag className="text-[#b8860b]" size={20} />
            <p className="text-xs font-bold text-[#d7ccc8] uppercase tracking-[0.2em]">
              All sales are final. No refunds on cursed artifacts.
            </p>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://i.pinimg.com/736x/94/81/69/948169b4793b4acfdf08ee4e33da34f2.jpg');
          background-size: cover;
          background-attachment: fixed;
          background-position: center;
        }
      `}} />
    </div>
  );
};

export default BlacksmithShop;
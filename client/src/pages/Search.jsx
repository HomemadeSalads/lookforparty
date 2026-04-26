import React, { useEffect, useState } from 'react';
import { Search, Scroll, ChevronLeft, AlertTriangle ,Users} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
//import { AuthContext } from '../context/authContext';
import axios from 'axios';

const ScrollSearch = () => {
    // use context of logging in 
    //const { currentUser } = useContext(AuthContext);
    //const { id } = currentUser;

    // if currenUser exist then isLoggedIn is true
    //const [isLoggedIn, setIsLoggedIn] = useState((!!currentUser));
    const navigate = useNavigate();
    const handleBackClick = e =>{
        navigate("/");
    }

    // Get the pathname: 
    const path = window.location.pathname; 
    // Split by "/" and get the last item
    const segments = path.split('/');
    const searchtag = segments.pop() || segments.pop() === null ? "CN" : segments.pop() || segments.pop();

    // search bar
    const [inputs, setInputs] = useState({
        tag:"CN"
      });
      const handleChange = (e) =>{
          setInputs(prev=>({...prev, [e.target.name]: e.target.value }));
      };
      const handleSearch = () =>{
        const {tag} = inputs;
        tag === null ? navigate(`/searchParty/CN`) : navigate(`/searchParty/${tag}`)
      }


    // getting post from backend
    const [posts,setPost] = useState([]);
    const [filteredScrolls, setFileteredScrollsNum] = useState(0);
    // get post that are not posted by user or member of
      useEffect(()=>{
          const FetchAllPost = async ()=>{
              try{
                  const res = await axios.post("http://localhost:8800/api/posts/searchParty",{
                    //id:id,
                    tag:searchtag
                  })
                  setFileteredScrollsNum(res.data.length)
                  setPost(res.data);
              }catch(err){
                  console.log(err)
              }
          }
          FetchAllPost()
      },[searchtag])
      //console.log(posts)

  return (
    <div className="min-h-screen bg-[#3d2b1f]/60 font-serif text-[#4a3728] backdrop-blur-[2px] p-6 lg:p-10">
      
      {/* NAVIGATION */}
      <button className="mb-8 flex items-center gap-2 text-[#d7ccc8] hover:text-white transition-colors uppercase text-sm font-bold tracking-widest group"
        onClick={handleBackClick}
        >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Return to Board
      </button>

      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* REDESIGNED SEARCH SECTION: THE "LEDGER SCROLL" */}
        <section className="relative">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black text-[#f5f5dc] uppercase tracking-tighter drop-shadow-lg">
              Guild Archives
            </h1>
            <p className="text-[#d7ccc8] text-xs uppercase tracking-[0.4em] mt-2 opacity-60">Consult the ancient records</p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            {/* Left Scroll Roller */}
            <div className="absolute -left-4 top-0 bottom-0 w-8 bg-[#3e2723] rounded-full shadow-2xl z-10 border-l-2 border-[#5d4037]" />
            
            {/* The Scroll Body */}
            <div 
              className="relative mx-2 bg-[#fdf6e3] border-y-4 border-[#3e2723] shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center px-8 py-4"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
            >
            <form className="flex-1 flex items-center gap-4 border-b-2 border-[#8d6e63]/30" onSubmit={(e) => {
                e.preventDefault(); // Prevents the page from refreshing
                handleSearch();
              }}>
                <Search className="text-[#8d6e63]" size={24} />
                <input 
                  type="text"
                  onChange={handleChange}
                  name='tag'                
                  placeholder="Inscribe your inquiry..."
                  className="w-full bg-transparent py-4 text-2xl focus:outline-none italic text-[#3e2723] placeholder-[#8d6e63]/40 font-medium"
                />
            </form>
              
            </div>

            {/* Right Scroll Roller */}
            <div className="absolute -right-4 top-0 bottom-0 w-8 bg-[#3e2723] rounded-full shadow-2xl z-10 border-r-2 border-[#5d4037]" />
          </div>
        </section>

        {/* RESULTS: PARCHMENT LEDGER */}
        <main 
          className="relative shadow-2xl border-2 border-[#3e2723]/20"
          style={{ 
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            backgroundColor: 'rgba(253, 246, 227, 0.92)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header of the Result Table */}
          <div className="bg-[#3e2723] text-[#d7ccc8] px-8 py-3 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
            <span>Record Entry</span>
            <span>Reward & Tag</span>
          </div>

          <div className="p-2">
            {filteredScrolls > 0 ? (
              <div className="divide-y-2 divide-[#d7ccc8]/50">
                {posts.map((scroll) => {
                  // 1. Check if the scroll is active
                  const isActive = scroll.status === "ACTIVE";

                  return (
                    <a
                      href={`/party/${scroll.postid}`}
                      key={scroll.postid}
                      /* We add grayscale and lower opacity if NOT active. 
                        We also keep the hover effect subtle for inactive items. */
                      className={`group flex flex-col md:flex-row md:items-center justify-between p-6 transition-all cursor-pointer
                        ${isActive 
                          ? "hover:bg-[#5d4037]/5" 
                          : "opacity-50 grayscale contrast-75 hover:opacity-70"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <Scroll 
                          size={20} 
                          className={`mt-1 transition-transform ${isActive ? "text-[#8d6e63] group-hover:rotate-12" : "text-gray-500"}`} 
                        />
                        <div>
                          <h3 className={`text-xl font-black uppercase tracking-tight leading-none transition-colors
                            ${isActive ? "text-[#3e2723] group-hover:text-[#b8860b]" : "text-gray-600"}`}>
                            {scroll.header}
                            {!isActive && <span className="ml-2 text-[10px] italic opacity-70">(Completed)</span>}
                          </h3>
                          
                          <div className="flex gap-4 mt-2 text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Users size={15} /> {scroll.partyname}</span>
                            <span className="opacity-40">/</span>
                            <span>{scroll.desc}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex items-center gap-8">
                        <div className="text-right">
                          <p className={`font-black flex items-center justify-end gap-1 text-lg ${isActive ? "text-[#5d4037]" : "text-gray-500"}`}>
                            {scroll.reward}
                          </p>
                        </div>
                        
                        {/* Your status tag logic updated with scroll.status */}
                        <div className={`w-24 text-center py-1 text-[15px] font-black border-2 uppercase
                          ${!isActive 
                            ? 'border-gray-400 text-gray-500' // Visual for Inactive
                            : scroll.tag === 'Urgent' 
                              ? 'border-[#8b0000] text-[#8b0000]' 
                              : 'border-[#2e4d2e] text-[#2e4d2e]'}`}>
                          {isActive ? scroll.tag : "Closed"}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <AlertTriangle size={48} className="mx-auto text-[#8b0000] opacity-30" />
                <p className="text-xl font-black text-[#8d6e63] uppercase italic">No records found in the archive.</p>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="h-4 bg-[#3e2723] w-full" />
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        body {
          background-image: url('https://i.pinimg.com/736x/c3/c2/65/c3c265c3f23e9f66fa132616a2c02370.jpg');
          background-size: cover;
          background-attachment: fixed;
        }
        input::placeholder {
          font-style: italic;
          opacity: 0.3;
          color: #3e2723;
        }
      `}} />
    </div>
  );
};

export default ScrollSearch;
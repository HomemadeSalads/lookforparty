import { db } from "../connect.js";

export const getUser = (req,res) =>{
    const profileid = req.params.profileid;
    const q = "SELECT player.id, username, email, class, score, link, gold FROM player JOIN gear ON player.id = gear.id JOIN profilepic ON profilepic.id = player.picId JOIN bank ON player.id = bank.id WHERE player.id = (?);"
    db.query(q,[profileid],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

export const changeClass = (req,res) =>{
    //const profileid = req.params.profileid;
    const q = "UPDATE gear SET class = (?) WHERE gear.id = (?)"
    const values = [
        req.body.class,
        req.body.id
    ]
    db.query(q,[...values],(err,data)=>{
        if(err) return res.json(err)
        return res.json("success")
    })
}

export const changeProfile = (req,res) =>{
    //const profileid = req.params.profileid;
    const q = "UPDATE player SET picId = (?) WHERE player.id = (?)"
    const values = [
        req.body.picId,
        req.body.id
    ]
    db.query(q,[...values],(err,data)=>{
        if(err) return res.json(err)
        return res.json("success")
    })
}

// get gold from bank only accessible via that session id 
export const getBank = (req,res) =>{
    //const profileid = req.params.profileid;
    const q = "SELECT * FROM bank WHERE id = (?);"
    db.query(q,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

// for generating gold from user
export const passiveIncom = (req,res) =>{
    const q = "UPDATE bank SET gold = gold + 100;"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json("updated every user wallet")
    })
}

// for adding gold to user 
export const addGold = (req,res) =>{
    const q = "UPDATE bank SET gold = gold + (?) WHERE id = (?);"
    const values = [
        req.body.amount,
        req.body.id
    ]
    db.query(q,[...values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(`added gold amount to user `)
    })
}

// for deduct subtract gold from user
export const deductGold = (req,res) =>{
    const q = "UPDATE bank SET gold = gold - (?) WHERE id = (?);"
    const values = [
        req.body.amount,
        req.body.id
    ]
    db.query(q,[...values],(err,data)=>{
        if(err) return res.json(err)
        return res.json(`deduted gold amount from user `)
    })
}

export const getUsername = (req,res) =>{
    const q = "SELECT player.username FROM player WHERE player.id = (?);"
    db.query(q,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

// get gear of the user
export const getUserGear = (req,res) =>{
    const q = "SELECT score FROM gear WHERE id = (?);"
    db.query(q,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

// get gear of the user
export const buyItem = (req,res) =>{
    const q = "UPDATE bank SET gold = gold - (?) WHERE id = (?);"
    const values = [
        req.body.price,
        req.body.id
    ]
    db.query(q,[...values],(err,data)=>{
        if(err) return res.json(err)
    })

    const q1 = "UPDATE gear SET score = score + (?) WHERE id = (?);"
    const values1 = [
        req.body.score,
        req.body.id
    ]   
    db.query(q1,[...values1],(err,data)=>{
        if(err) return res.json(err)
        return res.json("buy an item")
    })
    
}
import { db } from "../connect.js";

// getPost send back everypost that are not posted or been a member of and Party that is active
export const getPost = (req,res) =>{
    const q = `SELECT post.* ,player.username FROM post JOIN player ON player.id = post.id JOIN party ON party.postId = post.postid WHERE (post.postid NOT IN (SELECT postid FROM post JOIN member ON member.id = post.postid WHERE member.playerId = (?)) AND party.status = "ACTIVE");`
    db.query(q,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}
// the opposite send back post (party) that you are in 
export const getParty = (req,res) =>{
    const q = "SELECT post.postid, member.playerId AS member, partyname, party.member AS num, party.max, party.status  FROM post JOIN member ON member.id = post.postid JOIN party ON party.postId = post.postid WHERE member.playerId = (?)"
    db.query(q,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}
// send insert into post to db
export const postBounty = (req,res) =>{
    const q = "INSERT INTO post (`id`, `header`, `desc`, `reward`, `tag`) VALUE (?)"
    const value = [
        req.body.id,
        req.body.header,
        req.body.desc,
        req.body.reward,
        req.body.tag
    ]
    db.query(q,[value],(err,data)=>{
        if(err) return res.json(err)
        //return res.status(200).json("Created")
    })

    // find the lasted postid of this user
    const q2 = "SELECT postid FROM post WHERE id = (?) ORDER BY postid desc"
    db.query(q2,[req.body.id],(err,data)=>{
        if(err) return res.json(err)
        const { postid } = data[0];

        // created contact info
        const q3 = "INSERT INTO contact (`postid`, `contact`) VALUE (?)"
        const value2 = [
            postid,
            req.body.contact
        ]
        db.query(q3,[value2],(err,data)=>{
        if(err) return res.json(err)
        })    

        // create partytable
        const q4 = "INSERT INTO party (`postid`, `partyname`, `max`) VALUE (?)"
        const value3 = [
            postid,
            req.body.partyname,
            parseInt(req.body.max)
        ]
        db.query(q4,[value3],(err,data)=>{
        if(err) return res.json(err)
        })   

        // create membertable 
        const q5 = "INSERT INTO member (`id`, `playerId`) VALUE (?)"
        const value4 = [
            postid,
            parseInt(req.body.id)
        ]
        db.query(q5,[value4],(err,data)=>{
        if(err) return res.json(err)
        })    
        return res.status(200).json(data[0])
    })


}

// For party ui get member of the party
export const getMember = (req,res) =>{
    const postid = req.params.postid;
    //console.log(req.params.postid)
    const q = "SELECT member.playerId AS id, player.username, gear.class, profilepic.link, gear.score FROM member JOIN gear ON member.playerId = gear.id JOIN player ON player.id = member.playerId JOIN profilepic ON profilepic.id = player.picId WHERE member.id = (?)"
    db.query(q,[postid],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

export const getThisParty = (req,res) =>{
    const postid = req.params.postid;
    //console.log(req.params.postid)
    const q = "SELECT id as leader, party.partyname, header, post.desc, post.reward, contact.contact, party.member, party.max,party.status FROM post JOIN party ON post.postid = party.postid JOIN contact ON contact.postid = post.postid WHERE post.postid = (?)"
    db.query(q,[postid],(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

export const signupParty = (req,res) =>{
    const postid = req.params.postid;

    // check if party is full
    const q = "SELECT party.member, max FROM party WHERE party.postId = (?)"
    db.query(q,[postid],(err,data)=>{
        if(err) return res.json(err)
        // member cannot join if member = max 
        const { member,max } = data[0];
        if (member >= max){
            return res.status(400).json("party full")
        }

        const q1 = "UPDATE party SET member = (?) WHERE (postId = (?))"
        const value1 = [
            member+1,
            postid
        ]
        db.query(q1,[...value1],(err,data)=>{
            if(err) {return res.json(err)}
        })
        
        const q2 = "INSERT INTO member (`id`, `playerId`) VALUE (?)"
        const value2 = [
            postid,
            req.body.id
        ]
        db.query(q2,[value2],(err,data)=>{
            if(err) {return res.json(err)}
            return res.status(200).json("joined party")
        })
    

    })
}

export const leaveParty = (req,res) =>{
    const postid = req.params.postid;

    // check if party is full
    const q = "SELECT party.member, max FROM party WHERE party.postId = (?)"
    db.query(q,[postid],(err,data)=>{
        if(err) return res.json(err)
        // member cannot join if member = max 
        const { member,max } = data[0];

        const q1 = "UPDATE party SET member = (?) WHERE (postId = (?))"
        const value1 = [
            member-1,
            postid
        ]
        db.query(q1,[...value1],(err,data)=>{
            if(err) {return res.json(err)}
        })
        
        const q2 = "DELETE FROM member WHERE playerId = (?) AND id = (?);"
        const value2 = [
            req.body.id,
            postid
        ]
        db.query(q2,[...value2],(err,data)=>{
            if(err) {return res.json(err)}
            return res.status(200).json("deleted user from party")
        })
    

    })
}

// getPost that got specific tag (All)
export const searchParty = (req,res) =>{
    const q = `SELECT post.*, party.partyname, player.username, party.status FROM post JOIN party ON post.postid = party.postId JOIN player ON post.id = player.id WHERE post.tag like "${req.body.tag}%";`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}

export const submitResult = (req,res) =>{
    const q = `INSERT INTO postresult (postid, detail) VALUES (?);`
    const values = [
        req.body.postid,
        req.body.detail
    ]
    // first add result to db
    db.query(q,[values],(err,data)=>{
        if(err) return res.json(err)
    })

    const q2 = `UPDATE party SET party.status = "INACTIVE" WHERE party.postId = (?);`
    db.query(q2,[req.body.postid],(err,data)=>{
        if(err) return res.json(err)
        return res.json("completed a quest")
    })

}

// get all item in inventory
export const getInventory = (req,res) =>{
    const q = `SELECT * FROM blacksmith`
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
}


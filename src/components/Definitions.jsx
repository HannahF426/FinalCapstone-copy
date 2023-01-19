/*************************************************************************
 * This page is not used in our project but was used as a stepping stone
 * This may contain useful information about how some parts of the
 *      project's functionality for later use
 ************************************************************************/

import React, {useEffect, useState} from "react";
import './Definitions.css';

function Definitions(){
    
    /*
    const [def, setDef] = useState([{
        name: '',
        definition: ''
    }])

    useEffect(() => {
        fetch("/definitions").then(res => {
            if(res.ok) {
                return res.json()
            }
        }).then(jsonRes => setDef(jsonRes));
    })
    
    */

    const size = {
        height: 400,
        width:700
    }

    
    return <div className="container">
        <h1 className="title">Definitions Page</h1>
        <div className="container">
            <div className="Block">
                <div className={"img"}>
                    <img style={size} className='Blocktext' src='/images/causal.png'/>
                </div>
                <p className="Blocktext">
                Causal: If broadcast(m1) → broadcast(m2) then m1 must be delivered before m2
                </p>
            </div>
            <div className="Block">
                <img style={size} className='Blocktext' src='/images/FIFO.png'/>
                <p className="Blocktext">
                FIFO: Messages sent by the same node must be delivered in the order they were sent.
                Messages sent by different nodes can be delivered in any order
                </p>
            </div>
            <div className="Block">
                <img style={size} className='Blocktext' src='/images/FIFO total-order.png'/>
                <p className="Blocktext">
                FIFO Total Order: Combination of FIFO broadcast and total order broadcast, thus:
                If m1 and m2 are broadcast by the same node, and
                broadcast(m1) → broadcast(m2), then m1 must be delivered before m2.
                and If m1 is delivered before m2 on one node, then m1 must be
                delivered before m2 on all nodes.
                </p>
            </div>
            <div className="Block">
                <img style={size} className='Blocktext' src='/images/happens-before.png'/>
                <p className="Blocktext">
                Happens Before: We say event a happens before event b (written a → b) iff:
                1. a and b occurred at the same node, and a occurred
                before b in that nodes local execution order; or
                2. event a is the sending of some message m, and event b is
                the receipt of that same message m (assuming sent
                messages are unique); or
                3. there exists an event c such that a → c and c → b.
                </p>
            </div>
        </div>
        
        
        
        {/*
        {def.map(def =>
            <div>
                <h1>{def.name}</h1>
                <p>{def.definition}</p>
            </div>
            )}
        */}
    </div>
}

export default Definitions;
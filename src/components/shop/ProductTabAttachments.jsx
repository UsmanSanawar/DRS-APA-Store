// react
import React, {useEffect, useState} from 'react';
import RestService from '../../store/restService/restService';
import { IMAGE_URL } from '../../constant/constants';

 
function ProductTabAttachments(props) {

    const [attachments, setattachments] = useState([])

    useEffect(() => {
        RestService.getAttachmentsByPrId(props.productId).then(res =>{
            if(res.data.status === 'success'){
                setattachments(res.data.data)
            } 
        })
    }, [props.productId])


    const renderAttachments = () =>{
       return attachments.map(item => {
        return <a href={`${IMAGE_URL}/images/${item.name}`} target="_blank">{
        item.type === 'image' ? <span><img src={`${IMAGE_URL}/images/${item.name}`} height={100} width={100} style={{margin: 20}} />
        <h6>{item.title}</h6></span>
            :
        <span><img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTLmCtCpZT2olbcZ3Q0hGUA0YpMIbxeFx3QfQ&usqp=CAU"} height={100} width={100} style={{margin: 20}} />
        <h6>{item.title}</h6></span>
       }
           </a>
        })
    }


    return (
        <div className="spec">
            <h3 className="spec__header">Downloads</h3>
            <div className="spec__section" style={{display: 'inline-flex'}}>
{
    renderAttachments()
}

            </div>
        </div>
    );
}

export default ProductTabAttachments;

import React, { useEffect, useRef } from "react";
import QRCode from 'qrcode';

interface IProps {
  productName: string;
  productBarCode: string;
}

const TagGenerator = ({productName, productBarCode}:IProps) => {
  const imgRef = useRef(null);

  const drawText = (ctx:any, currentCursor:any, text:string, maxWidth:number) => {
    currentCursor.y += 65;
    ctx.fillText(text, currentCursor.x, currentCursor.y, maxWidth);

    return currentCursor;
  }

  useEffect(() => {
    if(!!productBarCode) {
      QRCode.toDataURL(productBarCode, {scale: 8, margin: 0}).then((qr) => {
        const cnvs = document.createElement('canvas');
        cnvs.width = 600;
        cnvs.height = 450;
        const ctx = cnvs.getContext('2d');
        ctx.font = '70px sans-serif';
        let currentCursor = {x: 10, y: -5};

        currentCursor = drawText(ctx, currentCursor, productName.substring(0, 17), 580);

        if(productName.length > 17) {
          currentCursor = drawText(ctx, currentCursor, productName.substring(17, 35).trimStart(), 580);
        }

        ctx.font = '50px sans-serif';
        currentCursor.y = 160;
        currentCursor = drawText(ctx, currentCursor, productBarCode.substring(0, 10), 280);

        if(productBarCode.length > 10) {
          currentCursor = drawText(ctx, currentCursor, productBarCode.substring(10, 20), 280);
        }

        if(productBarCode.length > 20) {
          currentCursor = drawText(ctx, currentCursor, productBarCode.substring(20, 30), 280);
        }

        if(productBarCode.length > 30) {
          currentCursor = drawText(ctx, currentCursor, productBarCode.substring(30, 40), 280);
        }
  
        const img = new Image;
        img.onload = () => {
          ctx.drawImage(img, 300, 150, 290, 290); // Or at whatever offset you like

          imgRef.current.src = cnvs.toDataURL();
        };
  
        img.src = qr;
      });
    }

  }, [productBarCode]);

  return(
    <img ref={imgRef} width="600" style={{ objectFit: 'contain'}} />
  );
};

export default TagGenerator;
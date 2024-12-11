'use client';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NavPrice = () => {
  const [currentTps, setCurrentTps] = useState(0);
  const [priceSol, setPriceSol] = useState(0);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    let respTps = await axios.get('/api/rpc/tps');
    setCurrentTps(respTps.data.tps || 0);

    let respPrice = await axios.get('/api/rpc/price');
    setPriceSol(respPrice.data.price || 0);
  };

  return (
    <div className="flex w-full items-center justify-end bg-black px-4 py-1 text-xs text-white">
      <div className="flex h-5 items-center space-x-4">
        <Separator orientation="vertical" />
        <div className="flex items-center">
          <img
            src="https://seeklogo.com/images/S/solana-sol-logo-12828AD23D-seeklogo.com.png"
            alt="solana"
            width={16}
            height={16}
          />
          <span>${priceSol}</span>
        </div>
        <Separator orientation="vertical" />
        <div>
          <span>Tps: </span>
          <span className="text-white">{currentTps}</span>
        </div>
      </div>
    </div>
  );
};

export default NavPrice;

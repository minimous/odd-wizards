'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
}

export default function MintModal({
  isOpen,
  onClose,
  loading
}: AlertModalProps) {
  return (
    <Modal title="" description="" isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full bg-black text-white">
        <div className="mx-auto grid gap-6 md:grid-cols-2">
          <div className="w-full space-y-4">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Steamland</h1>
              <p className="text-gray-400">
                Creator: <span className="text-[#32CD32]">FZxpaFE...WfN</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300">
              Step into the mystical world of Rebbits, a colony of rebellious
              rabbits who go on wild...
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="border-zinc-800 bg-zinc-900 p-2 px-4">
                <p className="mb-1 text-gray-400">Quantity</p>
                <p className="text-sm">1,554/1,555 (99%)</p>
              </Card>
              <Card className="border-zinc-800 bg-zinc-900 p-2 px-4">
                <p className="mb-1 text-gray-400">Royalties</p>
                <p className="text-sm">10%</p>
              </Card>
              <Card className="border-zinc-800 bg-zinc-900 p-2 px-4">
                <p className="mb-1 text-gray-400">Airdrop</p>
                <p className="text-sm">5%</p>
              </Card>
            </div>

            {/* Whitelist */}
            <Card className="border-zinc-800 bg-zinc-900 p-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <p>Whitelist · 9345 members</p>
              </div>
            </Card>

            {/* Mint Info */}
            <Card className="border-none bg-[#2D2D3F] p-2 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-gray-400">Mint price</p>
                  <p className="text-xl font-bold">FREE</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-gray-400">Start in:</p>
                  <p className="text-xl font-bold">1d 1h 15m</p>
                </div>
              </div>
            </Card>

            {/* Mint Controls */}
            <div className="space-y-4">
              <p className="text-gray-400">Max Mint: (0/5)</p>
              <div className="flex gap-4">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  defaultValue="1"
                  className="w-24 border-zinc-800 bg-zinc-900"
                />
                <Button className="h-12 flex-1 bg-gradient-to-r from-yellow-400 via-green-400 to-cyan-400 text-lg font-bold transition-opacity hover:opacity-90">
                  Mint
                </Button>
              </div>
            </div>
          </div>

          {/* NFT Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src="https://wallpapercave.com/wp/wp10537284.jpg"
              alt="Steamland NFT Preview"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

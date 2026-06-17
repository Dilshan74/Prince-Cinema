import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="bg-[#05070d] px-6 pb-10 pt-28 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-10 md:grid-cols-[1.6fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <img src={assets.logo} alt="QuickShow" className="h-10 w-auto" />
            <p className="mt-5 text-sm leading-7 text-white/60">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when
              an unknown printer took a galley of type and scrambled it to make a type specimen
              book.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <img src={assets.googlePlay} alt="Google Play" className="h-10 w-auto" />
              <img src={assets.appStore} alt="App Store" className="h-10 w-auto" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <div className="mt-6 space-y-4 text-sm text-white/65">
              <a href="#" className="block">
                Home
                </a>
              <a href="#" className="block">
                About us
              </a>
              <a href="#" className="block">
                Contact us
              </a>
              <a href="#" className="block">
                Privacy policy
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Get in touch</h3>
            <div className="mt-6 space-y-4 text-sm text-white/65">
              <p>+94 11 123 4567</p>
              <p>dilshan06akalanka2003@gmail.com</p>
            </div>
          </div>
        </div>

        <p className="pt-5 text-center text-sm text-white/45">
          Copyright 2025 © GreatStack. All Right Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer

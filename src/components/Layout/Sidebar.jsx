import React, { useState } from "react";
import { FiBarChart, FiChevronsRight, FiHome, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RiFileHistoryLine } from "react-icons/ri";
import { PiStudent } from "react-icons/pi";

const Sidebar = ({ open, setOpen }) => {
  return (
    <motion.nav
      animate={{
        width: open ? "225px" : "70px",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed z-[1000] top-0 left-0 h-screen border-r border-slate-300 bg-white shadow-md "
    >
      <div className="flex flex-col h-full">
        <TitleSection open={open} />

        <div className="flex-1 space-y-1 overflow-hidden pl-3">
          <Option
            Icon={FiHome}
            title="Dashboard"
            open={open}
            path="/dashboard"
          />

          <Option
            Icon={RiFileHistoryLine}
            title="History"
            open={open}
            path="/history"
          />
          <Option
            Icon={FiUsers}
            title="Employees"
            open={open}
            path="/employees"
          />
          <Option
            Icon={PiStudent}
            title="Visitors"
            open={open}
            path="/visitors"
          />
        </div>

        <ToggleClose open={open} setOpen={setOpen} />
      </div>
    </motion.nav>
  );
};

const Option = ({ Icon, title, open, path, notifs }) => {
  return (
    <Link
      to={path}
      className={`relative flex items-center w-full h-12 px-3 rounded-md transition-all hover:bg-slate-100 ${
        open ? "justify-start" : "justify-start"
      }`}
    >
      <div className="w-10 h-10 flex items-center justify-start">
        <Icon className="text-xl" />
      </div>

      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ml-3 text-sm font-medium text-slate-700"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </Link>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="p-4 border-b border-slate-300">
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-md bg-grey flex-shrink-0`}
        >
          <img src="https://masterpiecer-images.s3.yandex.net/a269bd637ca511ee91cc7a2f0d1382ba:upscaled" className="h-6 w-6"/>
         
        </div>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <span className="font-semibold text-slate-700">Bookstore</span>
            <span className="text-xs text-slate-500">Brest, Belarus</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="h-12 w-full flex items-center justify-start border-t border-slate-300"
    >
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-lg ml-3"
      >
        <FiChevronsRight />
      </motion.div>
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="ml-2 text-sm font-medium text-slate-700"
        >
          Hide
        </motion.span>
      )}
    </button>
  );
};

export default Sidebar;

import React from 'react';
import * as CiIcons from "react-icons/ci";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as GrIcons from 'react-icons/gr';
import * as LuIcons from 'react-icons/lu';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Performance & Analysis',
    path: '/performance/',
    icon: <GrIcons.GrDocumentPerformance />,
    cName: 'nav-text'
  },
  {
    title: 'Tasks',
    path: '/tasks/',
    icon: <LuIcons.LuListTodo />,
    cName: 'nav-text'
  },
  {
    title: 'Discussions',
    path: '/discussions/',
    icon: <IoIcons.IoMdPeople />,
    cName: 'nav-text'
  },
  {
    title: 'Calendar',
    path: '/calendar/',
    icon: <CiIcons.CiCalendar />,
    cName: 'nav-text'
  }
];

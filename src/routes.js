import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Home from './pages/Home';
import Repository from './pages/Repository';

const Pages = () => 
    (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/repository/:name' element={<Repository />} />
            </Routes>
        </BrowserRouter>
    )

export default Pages;

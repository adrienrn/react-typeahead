import React from 'react';

import s from './style.module.css';

export function Layout({
  children,
})
{
  return (
    <div className={s['layout__wrapper']}>
      <main className={s['layout__main']}>
        {children}
      </main>
    </div>
  );
}

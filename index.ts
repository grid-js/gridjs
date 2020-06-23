import Grid from './src/grid';

// FIXME: this is not the best way to bundle and compile themes
import './src/theme/mermaid';
import { html } from './src/util/html';
import { h, createElement, Component, createRef } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { UserConfig, Config } from './src/config';

export {
  Grid,
  html,
  UserConfig,
  Config,
  h,
  createElement,
  Component,
  createRef,
  useEffect,
  useRef,
};

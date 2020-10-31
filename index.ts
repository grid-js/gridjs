import Grid from './src/grid';

// FIXME: this is not the best way to bundle and compile themes
import './src/theme/mermaid';
import { html } from './src/util/html';
import { h, createElement, Component, createRef } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { UserConfig, Config } from './src/config';
import { BaseComponent, BaseProps } from './src/view/base';
import { PluginPosition } from './src/plugin';
import { Checkbox } from './src/view/plugin/checkbox/checkbox';

export {
  Grid,
  html,
  UserConfig,
  Config,
  BaseComponent,
  BaseProps,
  PluginPosition,
  h,
  createElement,
  Component,
  createRef,
  useEffect,
  useRef,
  Checkbox
};

import React from "react";
import NotFound from "../pages/NotFound";

export default class ErrorBoundary extends React.Component {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch(e) { console.error(e); }
  render() { return this.state.err ? <NotFound message="Something went wrong and the dice rolled off the table. Head back and try again." /> : this.props.children; }
}

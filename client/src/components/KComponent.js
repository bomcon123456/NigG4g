import { Component } from "react";

export class KComponent extends Component {
  onUnmounts = [];
  onMounts = [];

  componentDidMount() {
    this.mounted = true;
    this.onMounts.forEach(onMountFnc => onMountFnc());
  }

  componentWillUnmount() {
    this.mounted = false;
    this.onUnmounts.forEach(onUnmountFnc => onUnmountFnc());
  }

  onMount(f) {
    this.onMounts.push(f);
  }

  onUnmount(f) {
    this.onUnmounts.push(f);
  }
}

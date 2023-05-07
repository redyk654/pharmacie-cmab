import React, { Component } from 'react'
import { autoUpdater } from "electron-updater"

export default class VerifierMaj extends Component {
    
    verifierMaj() {
        autoUpdater.checkForUpdates()
    }

  render() {
    return (
      <button onClick={this.verifierMaj}>Verifier mises à jour</button>
    )
  }
}

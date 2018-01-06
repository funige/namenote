'use strict'

import { command } from './command.es6'
import { Timestamp } from './timestamp.es6'
import { config } from './config.es6'

const storage = window.require('electron-json-storage')
const maxRemain = 31
const day = 86400 * 1000

class Trial {}

Trial.showMessage = () => {
  nn.warn('installTime-' + nn.version)
  
  Trial.getInstallTime((installTime) => {
    const remain = (maxRemain * day - (Date.now() - installTime)) / day
    nn.warn('remain', remain)
    
    if (remain >= 0) {
      const message =
	T("Welcome to the trial version of Namenote.\nYou have ") +
	Math.ceil(remain) +
	T(" day(s) left.")
      namenote.app.showMessageBox({ type: 'warning', message: message },
				  (response) => null)

    } else {
      const message = T("We're sorry, but your trial period has expired.")
      namenote.app.showMessageBox({ type: 'error',  message: message },
				  (responce) => command.quit())
    }
  })
}

Trial.getInstallTime = (callback) => {
  Trial.getStorageInstallTime((time) => {
    // update time to extend trial period...
    const betatime = Timestamp.toInt("20171201000000")
    if (time < betatime) {
      time = betatime
      Trial.setConfigInstallTime(time)
      Trial.setStorageInstallTime(time)
      callback(time)
      return
    }
    
    const time2 = Trial.getConfigInstallTime()
    if (time2 > time) {
      Trial.setConfigInstallTime(time)
      callback(time)

    } else {
      Trial.setStorageInstallTime(time2)
      callback(time2)
    }
  })
}

Trial.getConfigInstallTime = () => {
  let timeString = config.data.installTime
  if (!timeString) {
    timeString = Timestamp.toString()
    config.data.installTime = timeString
    config.save()
  }
  return Timestamp.toInt(timeString)
}

Trial.setConfigInstallTime = (time) => {
  config.data.installTime = Timestamp.toString(time)
  config.save()
}

Trial.getStorageInstallTime = (callback) => {
  storage.get('trial', (err, data) => {
    if (!err) {
      let timeString = data.installTime
      if (timeString) {
	callback(Timestamp.toInt(timeString))
	return
      }
    }
    Trial.setStorageInstallTime(Timestamp.toInt(), (err) => {
      if (err) throw err
      callback(Timestamp.toInt())
    })
  })
}

Trial.setStorageInstallTime = (time, callback) => {
  storage.set('trial', { installTime: Timestamp.toString(time) }, callback)
}


export { Trial }

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor() {}

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7135/appointmentHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR bağlantısı başlatıldı'))
      .catch(err => console.error('SignalR bağlantı hatası: ', err));
  }

  listenForDeletedAppointments(callback: (appointmentId: string) => void) {
    this.hubConnection.on('ReceiveAppointmentDeleted', (appointmentId: string) => {
      console.log('💬 SignalR: Silinen randevu ID:', appointmentId); // Debug log
      callback(appointmentId); // Callback ile ID'yi ilet
    });
  }
}

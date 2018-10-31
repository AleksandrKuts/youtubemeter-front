import { Injectable } from '@angular/core';
import {Message} from 'primeng/components/common/api';

@Injectable()
export class MessageService {
  msgs: Message[] = [];

  addError(message: string) {
    this.msgs.push({severity: 'error', summary: 'Помилка', detail: message});
  }

  addSuccess(message: string) {
      this.msgs.push({severity: 'success', summary: 'Дія успішна', detail: message});
  }

  addWarn(message: string) {
      this.msgs.push({severity: 'warn', summary: 'До уваги', detail: message});
  }

  addInfo(message: string) {
      this.msgs.push({severity: 'info', summary: 'Інформація', detail: message});
  }

  clear() {
  }
}

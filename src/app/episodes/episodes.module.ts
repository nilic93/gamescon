import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EpisodeDetailsModalComponent } from './components/episode-details-modal/episode-details-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { FetchEpisodesDataService } from './fetch-episodes-data.service';

@NgModule({
  imports: [CommonModule, ModalModule.forRoot(), HttpClientModule, SharedModule],
  declarations: [EpisodeDetailsModalComponent],
  providers: [FetchEpisodesDataService],
  entryComponents: [EpisodeDetailsModalComponent],
})
export class EpisodesModule {}

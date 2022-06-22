import { Module } from "@nestjs/common";
import { FacebookGraphService } from "./facebook-graph.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [FacebookGraphService],
  exports: [FacebookGraphService],
})
export class FacebookGraphModule {}

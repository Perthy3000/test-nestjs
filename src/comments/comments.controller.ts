import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get(':postId')
  findCommentsByPostId(@Param('postId') postId: number) {
    return this.commentsService.findPostCommen(postId);
  }

  @UseGuards(AuthGuard)
  @Post()
  createComment(@Body() data: CreateCommentDto, @Request() req) {
    return this.commentsService.createComment(data, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updateComment(@Body() data: UpdateCommentDto, @Request() req) {
    return this.commentsService.updateComment(data, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteComment(@Param('id') id: number, @Request() req) {
    return this.commentsService.deleteComment(id, req.user.sub);
  }
}

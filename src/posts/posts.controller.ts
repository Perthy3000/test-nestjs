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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  getAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  createPost(@Body() data: CreatePostDto, @Request() req) {
    // Get user id from access token
    return this.postsService.create(data, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch()
  updatePost(@Body() data: UpdatePostDto, @Request() req) {
    // Get user id from access token
    return this.postsService.update(data, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@Param('id') id: number, @Request() req) {
    // Get user id from access token
    return this.postsService.delete(id, req.user.sub);
  }
}

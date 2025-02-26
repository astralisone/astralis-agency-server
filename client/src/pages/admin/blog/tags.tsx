import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { AlertCircle, CheckCircle2, Pencil, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

const tagSchema = z.object({
  name: z.string().min(2, { message: 'Tag name must be at least 2 characters' }),
  slug: z.string().min(2, { message: 'Slug must be at least 2 characters' }).regex(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  }),
});

type TagFormValues = z.infer<typeof tagSchema>;

export function BlogTagsPage() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const { data: tagsData, isLoading: isLoadingTags } = useApi<Tag[]>('/blog/tags');

  const { mutate: addTag, isLoading: isAddingTag } = useApiMutation<TagFormValues, Tag>('/blog/tags', {
    onSuccess: () => {
      setAddSuccess(true);
      setTimeout(() => setAddSuccess(false), 3000);
      form.reset({ name: '', slug: '' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      setAddError(error.message || 'Failed to add tag');
      setTimeout(() => setAddError(''), 3000);
    },
  });

  const { mutate: updateTag, isLoading: isUpdatingTag } = useApiMutation<TagFormValues & { id: string }, Tag>(`/blog/tags/${currentTag?.id}`, {
    onSuccess: () => {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsEditing(false);
      setCurrentTag(null);
      form.reset({ name: '', slug: '' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      setUpdateError(error.message || 'Failed to update tag');
      setTimeout(() => setUpdateError(''), 3000);
    },
  });

  const { mutate: deleteTag, isLoading: isDeletingTag } = useApiMutation<{ id: string }, { success: boolean }>(`/blog/tags/${tagToDelete?.id}`, {
    onSuccess: () => {
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
      setTagToDelete(null);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: any) => {
      setDeleteError(error.message || 'Failed to delete tag');
      setTimeout(() => setDeleteError(''), 3000);
    },
  });

  useEffect(() => {
    if (tagsData) {
      setTags(tagsData);
    }
  }, [tagsData]);

  const onSubmit = (data: TagFormValues) => {
    if (isEditing && currentTag) {
      updateTag({ ...data, id: currentTag.id });
    } else {
      addTag(data);
    }
  };

  const handleEditClick = (tag: Tag) => {
    setIsEditing(true);
    setCurrentTag(tag);
    form.reset({
      name: tag.name,
      slug: tag.slug,
    });
  };

  const handleDeleteClick = (tag: Tag) => {
    setTagToDelete(tag);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      deleteTag({ id: tagToDelete.id });
    }
  };

  const cancelDelete = () => {
    setTagToDelete(null);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentTag(null);
    form.reset({ name: '', slug: '' });
  };

  const generateSlug = () => {
    const name = form.getValues('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? 'Edit Tag' : 'Add New Tag'}</CardTitle>
              <CardDescription>
                {isEditing
                  ? 'Update the tag information below'
                  : 'Create a new tag for blog posts'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {addSuccess && (
                <Alert className="mb-4 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Tag added successfully!
                  </AlertDescription>
                </Alert>
              )}

              {addError && (
                <Alert className="mb-4 bg-red-50" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}

              {updateSuccess && (
                <Alert className="mb-4 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Tag updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {updateError && (
                <Alert className="mb-4 bg-red-50" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tag Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tag name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="enter-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="outline" onClick={generateSlug}>
                      Generate
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isAddingTag || isUpdatingTag}>
                      {isEditing ? 'Update Tag' : 'Add Tag'}
                    </Button>
                    {isEditing && (
                      <Button type="button" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Tags</CardTitle>
              <CardDescription>View, edit, and delete existing tags</CardDescription>
            </CardHeader>
            <CardContent>
              {deleteSuccess && (
                <Alert className="mb-4 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Success</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Tag deleted successfully!
                  </AlertDescription>
                </Alert>
              )}

              {deleteError && (
                <Alert className="mb-4 bg-red-50" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{deleteError}</AlertDescription>
                </Alert>
              )}

              {isLoadingTags ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : tags.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No tags found</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tags.map((tag) => (
                        <TableRow key={tag.id}>
                          <TableCell>{tag.name}</TableCell>
                          <TableCell>{tag.slug}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(tag)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(tag)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the tag "{tagToDelete?.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 
export interface CreateNotesDto {

    title: string;

    notesUrl?: string | null;

    notesFileId?: string;

    notesFileName?: string;

    description?: string;

    isActive?: boolean;

}

export interface GetNotesQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    isActive?: boolean;

}

export interface UpdateNotesDto extends Partial<CreateNotesDto> {}

USE [DB_Biletly]
GO
/****** Object:  Table [dbo].[Entrada]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Entrada](
	[idEntrada] [int] IDENTITY(1,1) NOT NULL,
	[numAsiento] [int] NULL,
	[precio] [float] NULL,
	[imagen] [varchar](max) NOT NULL,
	[tieneNFT] [bit] NULL,
	[descripcion] [varchar](max) NULL,
	[idEvento] [int] NULL,
 CONSTRAINT [PK_Entrada] PRIMARY KEY CLUSTERED 
(
	[idEntrada] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaxNFT]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntradaxNFT](
	[idEntradaxNFT] [int] IDENTITY(1,1) NOT NULL,
	[idEntrada] [int] NOT NULL,
	[tokenCount] [int] NOT NULL,
 CONSTRAINT [PK_EntradaxNFT] PRIMARY KEY CLUSTERED 
(
	[idEntradaxNFT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaxUsuario]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntradaxUsuario](
	[idEntradaxUsuario] [int] IDENTITY(1,1) NOT NULL,
	[idEntrada] [int] NULL,
	[idUsuario] [int] NULL,
 CONSTRAINT [PK_EntradaxUsuario] PRIMARY KEY CLUSTERED 
(
	[idEntradaxUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Evento]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Evento](
	[idEvento] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NULL,
	[fecha] [date] NULL,
	[descripcion] [varchar](max) NULL,
 CONSTRAINT [PK_Evento] PRIMARY KEY CLUSTERED 
(
	[idEvento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventoxTicketera]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EventoxTicketera](
	[idEventoxTicketera] [int] IDENTITY(1,1) NOT NULL,
	[idEvento] [int] NULL,
	[idTicketera] [int] NULL,
 CONSTRAINT [PK_EventoxTicketera] PRIMARY KEY CLUSTERED 
(
	[idEventoxTicketera] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ticketera]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ticketera](
	[idTicketera] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NULL,
	[url] [varchar](max) NULL,
 CONSTRAINT [PK_Ticketera] PRIMARY KEY CLUSTERED 
(
	[idTicketera] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[idUsuario] [int] IDENTITY(1,1) NOT NULL,
	[address] [varchar](max) NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[idUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Entrada] ON 

INSERT [dbo].[Entrada] ([idEntrada], [numAsiento], [precio], [imagen], [tieneNFT], [descripcion], [idEvento]) VALUES (1, 2, 232, N'https://drive.google.com/file/d/1WjeCtP_mJpEk9OjH76ZaW2SeHPh0li7f/view', 1, N'lorem impsum', NULL)
INSERT [dbo].[Entrada] ([idEntrada], [numAsiento], [precio], [imagen], [tieneNFT], [descripcion], [idEvento]) VALUES (2, 5, 2323, N'https://drive.google.com/file/d/1J3za6xn9DBIBrjxKuJmmAPcDaZnLis4S/view', 1, N'Gran entrada', NULL)
INSERT [dbo].[Entrada] ([idEntrada], [numAsiento], [precio], [imagen], [tieneNFT], [descripcion], [idEvento]) VALUES (3, 23, 988, N'https://drive.google.com/file/d/1VP7B2-ViAseC93G644TTvux2QR54QGff/view', 1, N'el nene gutman', NULL)
INSERT [dbo].[Entrada] ([idEntrada], [numAsiento], [precio], [imagen], [tieneNFT], [descripcion], [idEvento]) VALUES (4, 2121, 322, N'https://drive.google.com/file/d/1W8yW8UXI6OS6uWOo6sFH19LYfaT7SNy_/view', 0, N'weoiwi', NULL)
SET IDENTITY_INSERT [dbo].[Entrada] OFF
GO
SET IDENTITY_INSERT [dbo].[EntradaxUsuario] ON 

INSERT [dbo].[EntradaxUsuario] ([idEntradaxUsuario], [idEntrada], [idUsuario]) VALUES (1, NULL, NULL)
SET IDENTITY_INSERT [dbo].[EntradaxUsuario] OFF
GO
SET IDENTITY_INSERT [dbo].[Evento] ON 

INSERT [dbo].[Evento] ([idEvento], [nombre], [fecha], [descripcion]) VALUES (1, N'Rihana', CAST(N'2012-02-12' AS Date), N'lorem ipsim ')
INSERT [dbo].[Evento] ([idEvento], [nombre], [fecha], [descripcion]) VALUES (2, N'Snoop Dog', CAST(N'2015-03-23' AS Date), N'gran nombre')
INSERT [dbo].[Evento] ([idEvento], [nombre], [fecha], [descripcion]) VALUES (3, N'Duki', CAST(N'2023-02-23' AS Date), N'hijo de la noche')
INSERT [dbo].[Evento] ([idEvento], [nombre], [fecha], [descripcion]) VALUES (4, N'Niño G', CAST(N'1998-03-03' AS Date), N'el nene')
SET IDENTITY_INSERT [dbo].[Evento] OFF
GO
ALTER TABLE [dbo].[Entrada]  WITH CHECK ADD  CONSTRAINT [FK_Entrada_Evento] FOREIGN KEY([idEvento])
REFERENCES [dbo].[Evento] ([idEvento])
GO
ALTER TABLE [dbo].[Entrada] CHECK CONSTRAINT [FK_Entrada_Evento]
GO
ALTER TABLE [dbo].[EntradaxNFT]  WITH CHECK ADD  CONSTRAINT [FK_EntradaxNFT_Entrada] FOREIGN KEY([idEntrada])
REFERENCES [dbo].[Entrada] ([idEntrada])
GO
ALTER TABLE [dbo].[EntradaxNFT] CHECK CONSTRAINT [FK_EntradaxNFT_Entrada]
GO
ALTER TABLE [dbo].[EntradaxUsuario]  WITH CHECK ADD  CONSTRAINT [FK_EntradaxUsuario_Entrada] FOREIGN KEY([idEntrada])
REFERENCES [dbo].[Entrada] ([idEntrada])
GO
ALTER TABLE [dbo].[EntradaxUsuario] CHECK CONSTRAINT [FK_EntradaxUsuario_Entrada]
GO
ALTER TABLE [dbo].[EntradaxUsuario]  WITH CHECK ADD  CONSTRAINT [FK_EntradaxUsuario_Usuario] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[Usuario] ([idUsuario])
GO
ALTER TABLE [dbo].[EntradaxUsuario] CHECK CONSTRAINT [FK_EntradaxUsuario_Usuario]
GO
ALTER TABLE [dbo].[EventoxTicketera]  WITH CHECK ADD  CONSTRAINT [FK_EventoxTicketera_Evento] FOREIGN KEY([idEvento])
REFERENCES [dbo].[Evento] ([idEvento])
GO
ALTER TABLE [dbo].[EventoxTicketera] CHECK CONSTRAINT [FK_EventoxTicketera_Evento]
GO
ALTER TABLE [dbo].[EventoxTicketera]  WITH CHECK ADD  CONSTRAINT [FK_EventoxTicketera_Ticketera] FOREIGN KEY([idTicketera])
REFERENCES [dbo].[Ticketera] ([idTicketera])
GO
ALTER TABLE [dbo].[EventoxTicketera] CHECK CONSTRAINT [FK_EventoxTicketera_Ticketera]
GO
/****** Object:  StoredProcedure [dbo].[getEentradaxId]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[getEentradaxId]
@id int
as begin
SELECT * FROM Entrada WHERE idEntrada = @id
end
GO
/****** Object:  StoredProcedure [dbo].[UpdateEntrada]    Script Date: 23/5/2023 09:00:36 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



CREATE procedure [dbo].[UpdateEntrada]
@id int 
as
begin 


UPDATE Entrada set tieneNFT = 1 WHERE idEntrada = @id

end
GO

USE [DB_Biletly]
GO
/****** Object:  User [alumno]    Script Date: 12/5/2023 08:16:25 ******/
CREATE USER [alumno] FOR LOGIN [alumno] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[Entrada]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Entrada](
	[idEntrada] [int] IDENTITY(1,1) NOT NULL,
	[tipoEntrada] [varchar](50) NULL,
	[numAsiento] [int] NULL,
	[precio] [float] NULL,
	[imagen] [varchar](max) NOT NULL,
 CONSTRAINT [PK_Entrada] PRIMARY KEY CLUSTERED 
(
	[idEntrada] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaxEvento]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntradaxEvento](
	[idEntradaxEvento] [int] IDENTITY(1,1) NOT NULL,
	[idEntrada] [int] NULL,
	[idEvento] [int] NULL,
 CONSTRAINT [PK_EntradaxEvento] PRIMARY KEY CLUSTERED 
(
	[idEntradaxEvento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaxTokenId]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntradaxTokenId](
	[idEntradaxTokenId] [int] NOT NULL,
	[tokenId] [int] NOT NULL,
	[idEntrada] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntradaxUsuario]    Script Date: 12/5/2023 08:16:25 ******/
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
/****** Object:  Table [dbo].[Evento]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Evento](
	[idEvento] [int] IDENTITY(1,1) NOT NULL,
	[artista] [varchar](50) NULL,
	[fecha] [date] NULL,
 CONSTRAINT [PK_Evento] PRIMARY KEY CLUSTERED 
(
	[idEvento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EventoxTicketera]    Script Date: 12/5/2023 08:16:25 ******/
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
/****** Object:  Table [dbo].[Ticketera]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ticketera](
	[idTicketera] [int] NOT NULL,
	[nombre] [varchar](50) NULL,
	[url] [varchar](max) NULL,
 CONSTRAINT [PK_Ticketera] PRIMARY KEY CLUSTERED 
(
	[idTicketera] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 12/5/2023 08:16:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[idUsuario] [int] IDENTITY(1,1) NOT NULL,
	[nombreCompleto] [varchar](50) NULL,
	[address] [varchar](max) NULL,
	[idEntrada] [int] NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[idUsuario] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[EntradaxEvento]  WITH CHECK ADD  CONSTRAINT [FK_EntradaxEvento_Entrada] FOREIGN KEY([idEntrada])
REFERENCES [dbo].[Entrada] ([idEntrada])
GO
ALTER TABLE [dbo].[EntradaxEvento] CHECK CONSTRAINT [FK_EntradaxEvento_Entrada]
GO
ALTER TABLE [dbo].[EntradaxEvento]  WITH CHECK ADD  CONSTRAINT [FK_EntradaxEvento_Evento] FOREIGN KEY([idEvento])
REFERENCES [dbo].[Evento] ([idEvento])
GO
ALTER TABLE [dbo].[EntradaxEvento] CHECK CONSTRAINT [FK_EntradaxEvento_Evento]
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

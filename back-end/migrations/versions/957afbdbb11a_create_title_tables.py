"""Create title tables

Revision ID: 957afbdbb11a
Revises: 
Create Date: 2024-09-03 16:32:46.190103

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '957afbdbb11a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('title',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title_name', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title_id', sa.Integer(), nullable=False),
    sa.Column('task_title', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('due_date', sa.Date(), nullable=True),
    sa.Column('priority', sa.String(length=10), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['title_id'], ['title.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('task')
    op.drop_table('title')
    # ### end Alembic commands ###

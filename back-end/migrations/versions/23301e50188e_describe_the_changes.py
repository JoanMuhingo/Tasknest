"""Describe the changes

Revision ID: 23301e50188e
Revises: 957afbdbb11a
Create Date: 2024-09-16 15:57:00.278897

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '23301e50188e'
down_revision = '957afbdbb11a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.alter_column('description',
               existing_type=sa.VARCHAR(length=500),
               nullable=False)
        batch_op.drop_column('task_title')

    with op.batch_alter_table('title', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=False))
        batch_op.drop_column('title_name')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('title', schema=None) as batch_op:
        batch_op.add_column(sa.Column('title_name', sa.VARCHAR(length=100), nullable=False))
        batch_op.drop_column('name')

    with op.batch_alter_table('task', schema=None) as batch_op:
        batch_op.add_column(sa.Column('task_title', sa.VARCHAR(length=100), nullable=False))
        batch_op.alter_column('description',
               existing_type=sa.VARCHAR(length=500),
               nullable=True)

    # ### end Alembic commands ###
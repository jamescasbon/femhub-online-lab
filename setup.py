import os
import sys
import onlinelab
from setuptools import setup, find_packages


required_packages = [
    'Tornado>=1.1', 
    'Django>=1.1', 
    'argparse',
    'lockfile',
    'python-daemon',
    'psutil',
    'pycurl',
    'docutils',
]

if sys.platform == 'linux2' and os.uname()[2] > '2.6':
    required_packages.append('pyinotify')


ui_files = {}
for root, dirs, files in os.walk('ui'):
    if root not in ui_files:
        ui_files[root] = []
    for fname in files:
        ui_files[root].append(os.path.join(root,fname))        

setup(
    name='femhub-online-lab',
    version=onlinelab.__version__,
    url='https://github.com/hpfem/femhub-online-lab',
    install_requires=required_packages,
    scripts=["bin/onlinelab"],
    description='Interactive Programming Notebook for the Web Browser',
    author='',
    author_email='',
    license='',
    classifiers = ['Development Status :: 3 - Alpha'],
    packages=find_packages(),
    data_files=ui_files.items(),
    zip_safe=False
)

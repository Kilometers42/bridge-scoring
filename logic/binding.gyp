{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "addon.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ],
      "libraries":[
        "/home/ubuntu/workspace/libdds.so" 
      ],
      "cflags": ["-fopenmp" ],
    }
  ]
}

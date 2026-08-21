/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.04719283970708, "KoPercent": 1.9528071602929211};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7591164095371669, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8fd17d5-2db8-40ad-829d-d92f6c2da124"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c96ace60-4118-4333-b81f-f6a2485648d9"], "isController": false}, {"data": [0.028846153846153848, 500, 1500, "see books"], "isController": true}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.3557692307692308, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c96ace60-4118-4333-b81f-f6a2485648d9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e1ccadaa-5adf-46de-bada-54e8873443b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28c9c1d6-2ad0-4b42-9118-274fb3756530"], "isController": false}, {"data": [0.25, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e1ccadaa-5adf-46de-bada-54e8873443b5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8fd17d5-2db8-40ad-829d-d92f6c2da124"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d1e3fd65-d864-4228-9382-b214e22fd71a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8902439024390244, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1e3fd65-d864-4228-9382-b214e22fd71a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9375e548-af28-4eb2-885f-c121226092e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28c9c1d6-2ad0-4b42-9118-274fb3756530"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7a92a036-9151-4386-9785-7d555cdc77fc"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2af6c8b6-a3f7-4d76-a925-29931aeaf7d2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/23839726-797f-4672-905b-9401089de10d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/2af6c8b6-a3f7-4d76-a925-29931aeaf7d2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9375e548-af28-4eb2-885f-c121226092e9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/89bb40d2-4357-41b5-b101-83f63d85b3b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9b249a8-a833-40a3-ae7f-44181ec43672"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23839726-797f-4672-905b-9401089de10d"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7a92a036-9151-4386-9785-7d555cdc77fc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dcbbb5e8-3d35-4e00-8666-92bd31400305"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/371100b7-34f4-46eb-8aec-f52e903cc7d1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=89bb40d2-4357-41b5-b101-83f63d85b3b4"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/c9b249a8-a833-40a3-ae7f-44181ec43672"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1229, 24, 1.9528071602929211, 416.5337672904806, 104, 3244, 128.0, 1161.0, 1396.5, 1885.8000000000002, 4.822577037627088, 679.1290756097873, 3.535372145791723], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d8fd17d5-2db8-40ad-829d-d92f6c2da124", 3, 0, 0.0, 658.3333333333334, 302, 1178, 495.0, 1178.0, 1178.0, 1178.0, 0.01878510466434149, 0.022203357759187484, 0.012046437561442948], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c96ace60-4118-4333-b81f-f6a2485648d9", 1, 0, 0.0, 884.0, 884, 884, 884.0, 884.0, 884.0, 884.0, 1.1312217194570138, 0.20437111142533937, 0.7799243495475113], "isController": false}, {"data": ["see books", 52, 0, 0.0, 1877.192307692308, 1336, 2531, 1852.5, 2200.1, 2343.5499999999997, 2531.0, 0.23195749824916698, 279.1226542182809, 1.1405332067231988], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 395.4375, 220, 1081, 236.0, 896.9000000000002, 1081.0, 1081.0, 0.09816252032270929, 7.48240575822878, 0.21920007132120617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 162.23529411764707, 112, 369, 122.0, 349.0, 369.0, 369.0, 0.09973423759042083, 0.07743038953553179, 0.0354524047684699], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 400.40000000000003, 220, 579, 445.0, 511.20000000000005, 579.0, 579.0, 0.10885578060480272, 0.16870519904279485, 0.24481920188755923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 114.8, 109, 126, 114.0, 125.0, 126.0, 126.0, 0.052834854096550414, 0.03926496481198717, 0.02652062012268253], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 112.39999999999999, 106, 116, 112.5, 115.9, 116.0, 116.0, 0.05283876251618187, 0.014138497001400227, 0.030134606747509975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 112.4, 109, 116, 112.0, 115.9, 116.0, 116.0, 0.05283960010990637, 0.0142419234671232, 0.031063905533362923], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 134.5, 104, 343, 111.0, 320.4000000000001, 343.0, 343.0, 0.05283960010990637, 0.0142419234671232, 0.031115506705345252], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 116.0, 116, 116, 116.0, 116.0, 116.0, 116.0, 8.620689655172413, 2.5424299568965516, 5.329000538793103], "isController": false}, {"data": ["https://demoqa.com/books", 52, 0, 0.0, 1290.2500000000002, 881, 1895, 1233.0, 1706.3, 1839.85, 1895.0, 0.2427717058914157, 290.4393613470095, 0.4793792864379321], "isController": false}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 925.3333333333334, 141, 3244, 627.5, 2697.100000000002, 3244.0, 3244.0, 0.07295719844357977, 0.013875404684460118, 0.04929716948869164], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 925.3333333333334, 141, 3244, 627.5, 2697.100000000002, 3244.0, 3244.0, 0.07185972980741592, 0.013666682011713137, 0.048555610074135294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, 33.333333333333336, 1206.2380952380954, 283, 2536, 1162.0, 2211.6, 2506.5999999999995, 2536.0, 0.08296853517075715, 0.025927667240861606, 0.03743306957899395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 139.375, 108, 320, 115.0, 320.0, 320.0, 320.0, 0.05096677603287357, 0.013737138852610454, 0.030012662058420667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 148.35294117647052, 106, 321, 112.0, 316.2, 321.0, 321.0, 0.13692892583285005, 0.04873688100070881, 0.07741581388137123], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 111.625, 108, 115, 112.0, 115.0, 115.0, 115.0, 0.05103472913317513, 0.013755454336676107, 0.030002838806808034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 125.47058823529413, 106, 322, 114.0, 158.79999999999984, 322.0, 322.0, 0.1369245143206933, 0.10175737831840587, 0.06872968785237926], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 208.5294117647059, 105, 880, 114.0, 449.5999999999996, 880.0, 880.0, 0.13692892583285005, 2.403068038573684, 0.07994075558589471], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 176.58823529411768, 105, 985, 112.0, 472.19999999999953, 985.0, 985.0, 0.1369234114870688, 7.28202403257569, 0.07980382197540212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 249.1764705882353, 108, 1293, 116.0, 534.5999999999993, 1293.0, 1293.0, 0.10249422716338183, 5.450970124816867, 0.05973727187498116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 179.1764705882353, 108, 836, 114.0, 423.99999999999966, 836.0, 836.0, 0.1024886659592939, 1.7986501828216936, 0.05983411719578952], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c96ace60-4118-4333-b81f-f6a2485648d9", 3, 0, 0.0, 902.3333333333333, 214, 1427, 1066.0, 1427.0, 1427.0, 1427.0, 0.025609943487391373, 0.02568497261870209, 0.016423043186901368], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 112.125, 109, 116, 111.5, 116.0, 116.0, 116.0, 0.05103538027737729, 0.013655951363282596, 0.02910611531444174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 127.41176470588235, 110, 343, 115.0, 166.99999999999983, 343.0, 343.0, 0.1024899017302707, 0.07616681173509375, 0.05144512645445228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 114.0, 110, 118, 114.0, 118.0, 118.0, 118.0, 0.05103245025930864, 0.037925483054036986, 0.02561589788406703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 152.82352941176472, 108, 343, 114.0, 335.8, 343.0, 343.0, 0.10248804808498069, 0.03647839762951174, 0.05794389759032513], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 171.625, 119, 347, 126.5, 347.0, 347.0, 347.0, 0.049824058792389374, 0.039216983776040854, 0.01771089589885716], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 828.6666666666667, 116, 2627, 571.5, 2267.0000000000014, 2627.0, 2627.0, 0.07196358642526882, 0.013522454513016414, 0.04897717067663762], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1664.85, 1132, 2910, 1514.5, 2436.1000000000004, 2887.7, 2910.0, 0.08484930762964973, 0.04391614555050231, 0.0390273670835596], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 321.4166666666667, 115, 642, 265.5, 595.5000000000002, 642.0, 642.0, 0.07303401559276233, 0.15006207891325385, 0.047209406400822856], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 255.375, 223, 434, 231.5, 434.0, 434.0, 434.0, 0.050928165822107914, 0.07892871011688014, 0.11453863856280716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 136.87499999999997, 108, 490, 113.5, 232.40000000000026, 490.0, 490.0, 0.09823182711198428, 0.07300236370333989, 0.04930777259332024], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 138.6875, 106, 337, 113.0, 323.0, 337.0, 337.0, 0.09823062094031262, 0.035505477124544146, 0.05550653617342616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 747.5714285714286, 642, 902, 687.0, 902.0, 902.0, 902.0, 0.0624966519650733, 18.376090761878828, 0.035642621823830864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e1ccadaa-5adf-46de-bada-54e8873443b5", 3, 0, 0.0, 446.3333333333333, 286, 550, 503.0, 550.0, 550.0, 550.0, 0.05315661711288694, 0.03417458294204157, 0.03408806501054273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1237.2857142857142, 1092, 1469, 1228.0, 1469.0, 1469.0, 1469.0, 0.06224047942952156, 56.00409279777624, 0.035435741706456116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28c9c1d6-2ad0-4b42-9118-274fb3756530", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["addBook", 56, 13, 23.214285714285715, 1238.7857142857144, 562, 5327, 1005.0, 2065.4, 2401.4499999999994, 5327.0, 0.27198725545431585, 76.61458946771852, 0.9896296890481417], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 288.1428571428571, 104, 419, 334.0, 419.0, 419.0, 419.0, 0.06263869997852388, 0.11084113707137233, 0.034683733288889684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 114.3, 109, 119, 115.5, 118.8, 119.0, 119.0, 0.0497926137636743, 0.037004081127105605, 0.024993558080594325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 113.5, 110, 120, 113.5, 119.7, 120.0, 120.0, 0.04979286169534735, 0.013323480570825367, 0.028397491435627788], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 112.0, 106, 116, 112.5, 116.0, 116.0, 116.0, 0.04979236583447026, 0.013420598603822062, 0.029272465070655368], "isController": false}, {"data": ["https://demoqa.com/books-0", 52, 0, 0.0, 197.01923076923077, 108, 472, 116.0, 462.0, 467.09999999999997, 472.0, 0.24414864896588961, 0.18144250181937693, 0.11802107542784702], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 136.5, 109, 339, 115.0, 317.20000000000005, 339.0, 339.0, 0.04979286169534735, 0.013420732253824091, 0.02932138242411568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e1ccadaa-5adf-46de-bada-54e8873443b5", 1, 0, 0.0, 499.0, 499, 499, 499.0, 499.0, 499.0, 499.0, 2.004008016032064, 0.36205222945891785, 1.3816695891783568], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8fd17d5-2db8-40ad-829d-d92f6c2da124", 1, 0, 0.0, 1191.0, 1191, 1191, 1191.0, 1191.0, 1191.0, 1191.0, 0.8396305625524769, 0.15169106842989083, 0.5788859151973131], "isController": false}, {"data": ["https://demoqa.com/books-3", 52, 0, 0.0, 733.5192307692308, 523, 995, 673.5, 918.5, 966.1999999999999, 995.0, 0.24396995416179898, 71.73526708845318, 0.1226997328059829], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 174.42857142857144, 105, 334, 116.0, 334.0, 334.0, 334.0, 0.06281519768840073, 0.046681997500852494, 0.03527220573323283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1e3fd65-d864-4228-9382-b214e22fd71a", 3, 0, 0.0, 621.0, 401, 897, 565.0, 897.0, 897.0, 897.0, 0.02429307161597512, 0.02436424272422505, 0.015578564805817381], "isController": false}, {"data": ["https://demoqa.com/books-1", 52, 0, 0.0, 171.94230769230765, 104, 351, 116.5, 344.7, 348.0, 351.0, 0.24433679007240827, 0.4323615855578162, 0.11882785298443292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 904.6000000000003, 111, 1763, 1148.0, 1543.4, 1763.0, 1763.0, 0.0754956288030923, 45.294182479855245, 0.04005790200164077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 206.18749999999997, 105, 969, 112.0, 530.8000000000004, 969.0, 969.0, 0.09823182711198428, 5.5491449322353885, 0.05722195788310413], "isController": false}, {"data": ["https://demoqa.com/books-2", 52, 0, 0.0, 1091.5384615384614, 767, 1482, 1107.5, 1343.5, 1460.9499999999998, 1482.0, 0.24334771580730605, 218.96470244307068, 0.12214914641108916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 628.8000000000001, 113, 1020, 669.0, 994.2, 1020.0, 1020.0, 0.07549182926767893, 14.804852048596606, 0.040129608461627504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 208.9375, 108, 865, 114.5, 575.2000000000003, 865.0, 865.0, 0.09823122402244583, 1.830024200950387, 0.05731753550137831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 131.9333333333333, 111, 336, 118.0, 210.00000000000006, 336.0, 336.0, 0.11088277473055486, 0.08283722916882273, 0.039415361330001925], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 631.6666666666667, 116, 1191, 508.5, 1169.4, 1191.0, 1191.0, 0.07202059789099682, 0.013697276796163702, 0.04922696953828795], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 13, 7.926829268292683, 216.85365853658536, 107, 3193, 121.0, 423.5, 543.0, 1977.4999999999893, 0.7154511268355248, 1.53912991436399, 0.34377320989983684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 165.8, 114, 348, 121.0, 347.3, 348.0, 348.0, 0.052213868003341685, 0.040435153639306595, 0.018560398391812866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 253.1, 224, 456, 232.0, 434.20000000000005, 456.0, 456.0, 0.04976362279173924, 0.07712389586961932, 0.11191955399353073], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1e3fd65-d864-4228-9382-b214e22fd71a", 1, 0, 0.0, 500.0, 500, 500, 500.0, 500.0, 500.0, 500.0, 2.0, 0.361328125, 1.37890625], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 120.29411764705881, 113, 146, 119.0, 132.39999999999998, 146.0, 146.0, 0.14746064102008066, 0.11966776629656938, 0.0524176497376068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9375e548-af28-4eb2-885f-c121226092e9", 3, 0, 0.0, 546.6666666666666, 201, 952, 487.0, 952.0, 952.0, 952.0, 0.01871923026525149, 0.025805970108509137, 0.012004193887547344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28c9c1d6-2ad0-4b42-9118-274fb3756530", 3, 0, 0.0, 384.3333333333333, 245, 462, 446.0, 462.0, 462.0, 462.0, 0.027869644383337666, 0.027951293732116977, 0.01787213523280443], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 811.1, 251, 1705, 847.5, 1517.5000000000002, 1696.05, 1705.0, 0.08790204196443482, 0.05399451601135694, 0.03974477092727864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 161.46666666666667, 110, 348, 115.0, 344.4, 348.0, 348.0, 0.07557969627039392, 0.05616811412282204, 0.037937464729475075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 246.46666666666667, 108, 344, 326.0, 342.8, 344.0, 344.0, 0.07557969627039392, 0.09590158074934749, 0.03887236982656979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7a92a036-9151-4386-9785-7d555cdc77fc", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.3893622036637931, 1.4858903556034482], "isController": false}, {"data": ["login", 20, 0, 0.0, 3422.5499999999997, 1880, 5597, 3417.5, 4841.400000000001, 5561.45, 5597.0, 0.08213721020965523, 34.50264555612025, 0.17159778691554242], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 253.1, 224, 460, 228.5, 438.4000000000001, 460.0, 460.0, 0.052803328721842624, 0.08183484636871508, 0.11875592387344097], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 136.93750000000003, 111, 347, 119.5, 225.20000000000013, 347.0, 347.0, 0.09453024376986613, 0.0765288789894717, 0.033602547590069594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 404.1764705882353, 224, 1637, 234.0, 696.9999999999992, 1637.0, 1637.0, 0.1024164251848014, 7.356779854387941, 0.2287955169469061], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2af6c8b6-a3f7-4d76-a925-29931aeaf7d2", 1, 0, 0.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 0.16145135165326185, 0.6161332663092046], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23839726-797f-4672-905b-9401089de10d", 3, 0, 0.0, 318.6666666666667, 226, 495, 235.0, 495.0, 495.0, 495.0, 0.0426227179086453, 0.02701381242452227, 0.027332927825531005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2af6c8b6-a3f7-4d76-a925-29931aeaf7d2", 3, 0, 0.0, 1163.3333333333335, 221, 2627, 642.0, 2627.0, 2627.0, 2627.0, 0.045075501464953795, 0.02897920422958455, 0.028905839155585603], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9375e548-af28-4eb2-885f-c121226092e9", 1, 0, 0.0, 1047.0, 1047, 1047, 1047.0, 1047.0, 1047.0, 1047.0, 0.9551098376313276, 0.17255402340019102, 0.6585034622731615], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/89bb40d2-4357-41b5-b101-83f63d85b3b4", 3, 0, 0.0, 335.6666666666667, 225, 447, 335.0, 447.0, 447.0, 447.0, 0.07591477301482868, 0.03434945784199605, 0.04868232514297282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 158.9, 117, 415, 128.0, 389.5000000000001, 415.0, 415.0, 0.05006683923037254, 0.04151049463533817, 0.017797196757671493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1097.8666666666668, 229, 1878, 1287.0, 1659.0000000000002, 1878.0, 1878.0, 0.0754474031003853, 60.21319215919151, 0.15681369426951824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9b249a8-a833-40a3-ae7f-44181ec43672", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23839726-797f-4672-905b-9401089de10d", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7a92a036-9151-4386-9785-7d555cdc77fc", 3, 0, 0.0, 558.3333333333334, 477, 640, 558.0, 640.0, 640.0, 640.0, 0.046787273861509666, 0.030079708944167186, 0.030003557782283218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 127.13333333333334, 107, 220, 118.0, 170.20000000000005, 220.0, 220.0, 0.078003120124805, 0.0605590629875195, 0.027727671606864273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dcbbb5e8-3d35-4e00-8666-92bd31400305", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 0.6882240032327586, 1.2859476023706895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/371100b7-34f4-46eb-8aec-f52e903cc7d1", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=89bb40d2-4357-41b5-b101-83f63d85b3b4", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 356.0, 219, 1100, 232.0, 737.5999999999997, 1100.0, 1100.0, 0.1367978047975795, 9.82646418915113, 0.3056025867861367], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 1124.2222222222222, 115, 1625, 1345.0, 1625.0, 1625.0, 1625.0, 0.07994812255158876, 74.39589199896956, 0.1519847121423432], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 113.66666666666666, 109, 120, 113.0, 118.2, 120.0, 120.0, 0.10894512071119375, 0.08096409849728364, 0.054685343794485926], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9b249a8-a833-40a3-ae7f-44181ec43672", 3, 0, 0.0, 1355.6666666666667, 237, 2931, 899.0, 2931.0, 2931.0, 2931.0, 0.01612833856608318, 0.02223421674067782, 0.010342717114317663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 210.66666666666669, 105, 464, 115.0, 393.20000000000005, 464.0, 464.0, 0.10895224260032685, 0.02915323678954058, 0.06213682585799891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 172.13333333333333, 108, 345, 113.0, 341.4, 345.0, 345.0, 0.10895145123333043, 0.029365820840233595, 0.06405153676021966], "isController": false}, {"data": ["register", 21, 7, 33.333333333333336, 1206.2380952380954, 283, 2536, 1162.0, 2211.6, 2506.5999999999995, 2536.0, 0.0869799324870048, 0.027181228902188995, 0.03924289922753536], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 217.26666666666665, 106, 349, 117.0, 348.4, 349.0, 349.0, 0.10895303397881953, 0.0293662474396037, 0.06415886668869938], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 29.166666666666668, 0.5695687550854354], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.166666666666667, 0.08136696501220504], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.166666666666667, 0.08136696501220504], "isController": false}, {"data": ["401/Unauthorized", 15, 62.5, 1.2205044751830756], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1229, 24, "401/Unauthorized", 15, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 164, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 69.9367088607595, "KoPercent": 30.063291139240505};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5349243306169965, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8dee6093-1522-46f9-8d3a-e92c71964517"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4b098c87-c169-429e-af9d-e25175f01c27"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/90f7fddf-5ee0-4c8f-ba0a-d5d77375cc99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7790d0e8-a44b-42e3-be5c-b30db42610d0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b238d99-22da-4055-8f4c-52b60f5aa42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6b238d99-22da-4055-8f4c-52b60f5aa42d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4b098c87-c169-429e-af9d-e25175f01c27"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a8cbaadf-39b5-443a-adbb-26452a265270"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.8, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.4166666666666667, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d81e5e5a-fa21-4597-aaaa-eb3d040cee7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6dc55834-b602-45be-8992-77d67bf86867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=90f7fddf-5ee0-4c8f-ba0a-d5d77375cc99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a4952a4d-fd17-463a-854e-18ef0896060d"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54b1bc45-68f6-43c8-a151-b59751ed2d5a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a4952a4d-fd17-463a-854e-18ef0896060d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6b7b8dd4-8603-4fa6-af09-7b494036d244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/82254188-07fb-4c16-9591-e5d252ed4569"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6b7b8dd4-8603-4fa6-af09-7b494036d244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6dc55834-b602-45be-8992-77d67bf86867"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=54b1bc45-68f6-43c8-a151-b59751ed2d5a"], "isController": false}, {"data": [0.9719101123595506, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22c420e0-5b70-4630-88b5-3168b091a44a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=82254188-07fb-4c16-9591-e5d252ed4569"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7ec2a380-aa1c-48a3-a675-4c17bef5339d"], "isController": false}, {"data": [0.7708333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/917e65e2-05c2-4782-bac5-cad932318c43"], "isController": false}, {"data": [0.125, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d81e5e5a-fa21-4597-aaaa-eb3d040cee7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a8cbaadf-39b5-443a-adbb-26452a265270"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=917e65e2-05c2-4782-bac5-cad932318c43"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22c420e0-5b70-4630-88b5-3168b091a44a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7ec2a380-aa1c-48a3-a675-4c17bef5339d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d629dad7-0dfc-4e25-9b94-beb8789eb7f3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5220bf59-3a0d-4ba0-88b4-9ef93b075b62"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d5c298d5-a254-4557-a482-7f0ab235fa58"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5220bf59-3a0d-4ba0-88b4-9ef93b075b62"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d5c298d5-a254-4557-a482-7f0ab235fa58"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d4172d3-b1a7-4470-83b4-b8741ec5eef7"], "isController": false}, {"data": [0.3541666666666667, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f55bf7d-ed93-4b55-8f42-19936aae69fa"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 632, 190, 30.063291139240505, 279.6534810126584, 99, 2836, 107.0, 693.700000000001, 1002.4000000000001, 1729.7199999999993, 2.4761785356068207, 2.5716569263454425, 1.1896843178461165], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/8dee6093-1522-46f9-8d3a-e92c71964517", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["see books", 60, 60, 100.0, 616.7, 403, 3143, 609.0, 728.0, 742.55, 3143.0, 0.2644290096252159, 1.7006434990127983, 0.4438998706501428], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, 100.0, 122.94736842105262, 99, 298, 103.0, 297.0, 298.0, 298.0, 0.08512430388480441, 0.04231276433336469, 0.04272841034842722], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 105.35294117647061, 101, 120, 104.0, 111.19999999999999, 120.0, 120.0, 0.10151981129258607, 0.07881665036875578, 0.03608712042041145], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4b098c87-c169-429e-af9d-e25175f01c27", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/90f7fddf-5ee0-4c8f-ba0a-d5d77375cc99", 3, 0, 0.0, 671.6666666666666, 262, 910, 843.0, 910.0, 910.0, 910.0, 0.017693895606015926, 0.02439246350634031, 0.011346671335889118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7790d0e8-a44b-42e3-be5c-b30db42610d0", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 0.6152908236994219, 1.1496718448940269], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, 100.0, 102.0625, 99, 104, 102.5, 104.0, 104.0, 104.0, 0.11858703547234699, 0.0589460947806881, 0.059525133039830425], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b238d99-22da-4055-8f4c-52b60f5aa42d", 1, 0, 0.0, 566.0, 566, 566, 566.0, 566.0, 566.0, 566.0, 1.7667844522968197, 0.31919445671378094, 1.2181150618374559], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b238d99-22da-4055-8f4c-52b60f5aa42d", 3, 0, 0.0, 306.0, 191, 476, 251.0, 476.0, 476.0, 476.0, 0.019914897006790982, 0.02745429323690098, 0.012770946322714269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4b098c87-c169-429e-af9d-e25175f01c27", 3, 0, 0.0, 319.6666666666667, 241, 458, 260.0, 458.0, 458.0, 458.0, 0.02080083203328133, 0.028675626191714338, 0.013339075229675854], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, 100.0, 173.6333333333334, 99, 423, 102.5, 408.4, 411.95, 423.0, 0.2573494720046666, 0.12792078247106964, 0.12440233265850584], "isController": false}, {"data": ["deleteBook", 15, 0, 0.0, 633.5333333333333, 378, 1653, 530.0, 1351.8000000000002, 1653.0, 1653.0, 0.0965039823976736, 0.017434801507392204, 0.06559255053591878], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 0, 0.0, 633.5333333333333, 378, 1653, 530.0, 1351.8000000000002, 1653.0, 1653.0, 0.09803537116191521, 0.01771146842280695, 0.06663341633661425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, 16.666666666666668, 1075.4583333333335, 529, 1764, 995.0, 1620.5, 1749.75, 1764.0, 0.0993533751169472, 0.03163007840637186, 0.044825448539091414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a8cbaadf-39b5-443a-adbb-26452a265270", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 107.25, 101, 126, 105.0, 126.0, 126.0, 126.0, 0.045572879579362326, 0.035870840762662136, 0.01619973453797645], "isController": false}, {"data": ["deleteAccount", 15, 0, 0.0, 609.0666666666667, 358, 1480, 458.0, 1138.0000000000002, 1480.0, 1480.0, 0.10084643776766325, 0.018219327135759474, 0.06864254601959109], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1155.0416666666667, 649, 2089, 1031.0, 1881.0, 2073.5, 2089.0, 0.09842600415029651, 0.05094314667935269, 0.04527211714334927], "isController": false}, {"data": ["goToProfile", 15, 0, 0.0, 233.4666666666667, 179, 390, 206.0, 339.0, 390.0, 390.0, 0.09743486479288596, 0.231242875075512, 0.06299011766883837], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, 100.0, 127.5, 101, 302, 102.5, 302.0, 302.0, 302.0, 0.04703890117126864, 0.02338164130485912, 0.023611323439484452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d81e5e5a-fa21-4597-aaaa-eb3d040cee7b", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6dc55834-b602-45be-8992-77d67bf86867", 3, 0, 0.0, 290.0, 185, 380, 305.0, 380.0, 380.0, 380.0, 0.07726781023025808, 0.0349616719466337, 0.049549995492711066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=90f7fddf-5ee0-4c8f-ba0a-d5d77375cc99", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a4952a4d-fd17-463a-854e-18ef0896060d", 3, 0, 0.0, 262.3333333333333, 206, 361, 220.0, 361.0, 361.0, 361.0, 0.029078220412910732, 0.029163410511776677, 0.01864716608510226], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 641.7118644067799, 408, 2230, 594.0, 790.0, 900.0, 2230.0, 0.2804715725423084, 0.8726808729677695, 0.5494394282420612], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/54b1bc45-68f6-43c8-a151-b59751ed2d5a", 3, 0, 0.0, 302.0, 196, 458, 252.0, 458.0, 458.0, 458.0, 0.0822278258962833, 0.03720594986843548, 0.05273073470562438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a4952a4d-fd17-463a-854e-18ef0896060d", 1, 0, 0.0, 520.0, 520, 520, 520.0, 520.0, 520.0, 520.0, 1.9230769230769231, 0.3474308894230769, 1.3258713942307692], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6b7b8dd4-8603-4fa6-af09-7b494036d244", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 0.27045518338323354, 1.0321154565868262], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82254188-07fb-4c16-9591-e5d252ed4569", 3, 0, 0.0, 374.0, 189, 743, 190.0, 743.0, 743.0, 743.0, 0.028302687811919205, 0.02838560584261819, 0.01814983560855496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6b7b8dd4-8603-4fa6-af09-7b494036d244", 3, 0, 0.0, 628.3333333333333, 201, 1480, 204.0, 1480.0, 1480.0, 1480.0, 0.034755610134735916, 0.028634911865565302, 0.022287940092913332], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6dc55834-b602-45be-8992-77d67bf86867", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 116.75000000000001, 101, 298, 104.0, 168.5000000000001, 298.0, 298.0, 0.1146123595103187, 0.08562349123573613, 0.040741112169683597], "isController": false}, {"data": ["deleteBooks", 15, 0, 0.0, 417.80000000000007, 188, 668, 408.0, 606.8000000000001, 668.0, 668.0, 0.09802127715189378, 0.01770892214169956, 0.06758107584886426], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=54b1bc45-68f6-43c8-a151-b59751ed2d5a", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 0.8521889740566038, 3.252137382075472], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, 1.6853932584269662, 175.96629213483158, 100, 1921, 107.0, 312.29999999999984, 427.09999999999997, 868.7200000000106, 0.732896340459172, 1.5924789794109653, 0.3510722726374386], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 145.42857142857144, 101, 308, 102.5, 304.5, 308.0, 308.0, 0.07063465235137713, 0.05470046808070513, 0.025108411578028587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, 100.0, 102.63636363636363, 100, 107, 102.0, 106.6, 107.0, 107.0, 0.05836503615979286, 0.029011526763022037, 0.029296512291146024], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22c420e0-5b70-4630-88b5-3168b091a44a", 3, 0, 0.0, 312.3333333333333, 189, 390, 358.0, 390.0, 390.0, 390.0, 0.06374569716544133, 0.04135585105817857, 0.04087858835153627], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 130.73333333333335, 101, 306, 104.0, 302.4, 306.0, 306.0, 0.10081729218195504, 0.08181559551094204, 0.03583739683030433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=82254188-07fb-4c16-9591-e5d252ed4569", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7ec2a380-aa1c-48a3-a675-4c17bef5339d", 1, 0, 0.0, 394.0, 394, 394, 394.0, 394.0, 394.0, 394.0, 2.5380710659898473, 0.45853822969543145, 1.7498810279187818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 544.6666666666666, 164, 1719, 471.0, 897.5, 1531.75, 1719.0, 0.10063441613169691, 0.06181547631527085, 0.045501694012671554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/917e65e2-05c2-4782-bac5-cad932318c43", 3, 0, 0.0, 607.3333333333334, 181, 860, 781.0, 860.0, 860.0, 860.0, 0.03126661038676797, 0.031358211784385456, 0.02005052814516045], "isController": false}, {"data": ["login", 24, 4, 16.666666666666668, 1985.791666666667, 1217, 3311, 1953.0, 3125.5, 3286.25, 3311.0, 0.09900581659172476, 0.1466072459882018, 0.14879878099088323], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, 100.0, 116.07142857142856, 99, 308, 101.0, 206.5, 308.0, 308.0, 0.07138595838198626, 0.035483840641045906, 0.03583240489095795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 180.42105263157896, 101, 545, 105.0, 307.0, 545.0, 545.0, 0.08450528825198587, 0.06841297261806278, 0.030038989183323105], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 148.17647058823533, 100, 302, 102.0, 301.2, 302.0, 302.0, 0.10282900745812742, 0.051113246871276226, 0.051615341634255366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d81e5e5a-fa21-4597-aaaa-eb3d040cee7b", 3, 0, 0.0, 268.3333333333333, 179, 386, 240.0, 386.0, 386.0, 386.0, 0.019440754301266887, 0.022978313433561222, 0.012466889965330656], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a8cbaadf-39b5-443a-adbb-26452a265270", 3, 0, 0.0, 246.66666666666666, 181, 366, 193.0, 366.0, 366.0, 366.0, 0.041883647228000614, 0.027199829498652746, 0.026858979504935293], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=917e65e2-05c2-4782-bac5-cad932318c43", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 0.5191496048850575, 1.9811871408045978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22c420e0-5b70-4630-88b5-3168b091a44a", 1, 0, 0.0, 444.0, 444, 444, 444.0, 444.0, 444.0, 444.0, 2.2522522522522523, 0.4069010416666667, 1.5528223536036037], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7ec2a380-aa1c-48a3-a675-4c17bef5339d", 3, 0, 0.0, 471.66666666666663, 277, 841, 297.0, 841.0, 841.0, 841.0, 0.014917802905988006, 0.020565395607701563, 0.009566429597915486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d629dad7-0dfc-4e25-9b94-beb8789eb7f3", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 1.5887360074626864, 2.96855565920398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5220bf59-3a0d-4ba0-88b4-9ef93b075b62", 1, 0, 0.0, 188.0, 188, 188, 188.0, 188.0, 188.0, 188.0, 5.319148936170213, 0.9609790558510638, 3.6673038563829787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 162.54545454545453, 100, 308, 110.0, 307.2, 308.0, 308.0, 0.05476887534603971, 0.045408960125769254, 0.019468623658162553], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, 100.0, 129.05263157894737, 99, 427, 101.0, 296.0, 427.0, 427.0, 0.08639387421961323, 0.04294383005642884, 0.043365675145391795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 270.94736842105266, 101, 2836, 105.0, 315.0, 2836.0, 2836.0, 0.08349116092262128, 0.06481979778660539, 0.029678498609213032], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d5c298d5-a254-4557-a482-7f0ab235fa58", 1, 0, 0.0, 377.0, 377, 377, 377.0, 377.0, 377.0, 377.0, 2.6525198938992043, 0.4792150198938992, 1.8287881299734747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5220bf59-3a0d-4ba0-88b4-9ef93b075b62", 3, 0, 0.0, 261.6666666666667, 187, 402, 196.0, 402.0, 402.0, 402.0, 0.08115785202218315, 0.036721814554308126, 0.05204458609495468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d5c298d5-a254-4557-a482-7f0ab235fa58", 3, 0, 0.0, 412.0, 227, 736, 273.0, 736.0, 736.0, 736.0, 0.02284600271105899, 0.02700320177208828, 0.014650594186453845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, 100.0, 102.06666666666666, 99, 106, 102.0, 104.8, 106.0, 106.0, 0.09881943712448614, 0.04912020849254243, 0.04960272527537683], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 198.75, 99, 297, 199.5, 297.0, 297.0, 297.0, 0.1388888888888889, 0.06903754340277778, 0.07798936631944445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d4172d3-b1a7-4470-83b4-b8741ec5eef7", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["register", 24, 4, 16.666666666666668, 1075.4583333333335, 529, 1764, 995.0, 1620.5, 1749.75, 1764.0, 0.09765108453735764, 0.031088138241385344, 0.044057422906503156], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9f55bf7d-ed93-4b55-8f42-19936aae69fa", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.1052631578947367, 0.6329113924050633], "isController": false}, {"data": ["401/Unauthorized", 3, 1.5789473684210527, 0.47468354430379744], "isController": false}, {"data": ["404/Not Found", 183, 96.3157894736842, 28.955696202531644], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 632, 190, "404/Not Found", 183, "406/Not Acceptable", 4, "401/Unauthorized", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 16, "404/Not Found", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 60, 60, "404/Not Found", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 8, "404/Not Found", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 11, "404/Not Found", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

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

    var data = {"OkPercent": 99.17849141150111, "KoPercent": 0.8215085884988798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8159252095422308, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3620689655172414, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a5a7b081-6829-42f1-bd27-126a4b952672"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04eee995-cada-4e49-a301-53499efb060f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.6, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/818cbb30-2076-44d8-ba47-239fd7a45a64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d600572f-6478-47d6-b52d-517153cf6e59"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c2b8f3fe-6094-4cc3-8aff-fe7c2bd5ada0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aca04a6b-3640-41a7-9431-53b900e1aa5e"], "isController": false}, {"data": [0.6190476190476191, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/44fa02d5-e705-4116-989d-5dc3e2db32e4"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8ce4a9a-0bd9-4736-924d-5ec71f188def"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=10b728c0-03ff-497c-b87c-fe1d7a4946ee"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ad65d324-89e3-4003-aa68-9cbe627effa2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c73eaacc-7ed9-4c55-9110-ff8ea78b525e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=645ab5e7-edc0-4a9f-8e62-b4d308a4d9d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/10b728c0-03ff-497c-b87c-fe1d7a4946ee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=48d7c0ff-7431-420a-90d8-fffaf449ef66"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/04eee995-cada-4e49-a301-53499efb060f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.75, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/393697e1-2f9a-4609-baae-0dbfbe7c49c5"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88ba9295-139a-4ddf-b586-a3c2197a5de5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d600572f-6478-47d6-b52d-517153cf6e59"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8ff450a3-f175-494c-b3d6-62d1cd643f5d"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a5a7b081-6829-42f1-bd27-126a4b952672"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8103448275862069, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ad65d324-89e3-4003-aa68-9cbe627effa2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=818cbb30-2076-44d8-ba47-239fd7a45a64"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8ff450a3-f175-494c-b3d6-62d1cd643f5d"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44fa02d5-e705-4116-989d-5dc3e2db32e4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8ce4a9a-0bd9-4736-924d-5ec71f188def"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/48d7c0ff-7431-420a-90d8-fffaf449ef66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/645ab5e7-edc0-4a9f-8e62-b4d308a4d9d6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aca04a6b-3640-41a7-9431-53b900e1aa5e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1339, 11, 0.8215085884988798, 321.53398058252424, 76, 5074, 97.0, 885.0, 1057.0, 1679.6, 5.2994443301090755, 742.0930470642305, 3.8806288971595135], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 0, 0.0, 1370.8620689655174, 987, 2043, 1346.0, 1669.6, 1715.45, 2043.0, 0.25266716328833244, 304.0423164065393, 1.2423624679265175], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a5a7b081-6829-42f1-bd27-126a4b952672", 3, 0, 0.0, 279.3333333333333, 189, 455, 194.0, 455.0, 455.0, 455.0, 0.021997199023324365, 0.02206164394233801, 0.014106276717431313], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 622.5384615384614, 407, 1125, 564.0, 1091.0, 1125.0, 1125.0, 0.06470108100575342, 0.011689160142640998, 0.043976515996098024], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 622.5384615384614, 407, 1125, 564.0, 1091.0, 1125.0, 1125.0, 0.06599252761533463, 0.011922478133629793, 0.04485429611354776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 91.57142857142857, 77, 230, 81.0, 157.5, 230.0, 230.0, 0.11643573579068182, 0.031155655865866033, 0.06640475556812322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 95.07142857142858, 78, 245, 82.5, 170.0, 245.0, 245.0, 0.11643573579068182, 0.08653085443037975, 0.058445281441807086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 138.2857142857143, 78, 250, 81.5, 247.0, 250.0, 250.0, 0.11628776237426386, 0.031343185952438304, 0.06847804757000107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 126.92857142857142, 78, 249, 81.5, 246.0, 249.0, 249.0, 0.11627424110294422, 0.03133954154727794, 0.06835653627341057], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 243.84615384615384, 183, 475, 192.0, 448.59999999999997, 475.0, 475.0, 0.06448444684745461, 0.15695801132446094, 0.04168818731739741], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04eee995-cada-4e49-a301-53499efb060f", 1, 0, 0.0, 191.0, 191, 191, 191.0, 191.0, 191.0, 191.0, 5.235602094240838, 0.9458851439790575, 3.60970222513089], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 13, 0, 0.0, 82.92307692307692, 79, 86, 83.0, 85.6, 86.0, 86.0, 0.06858529636761718, 0.050970127476324886, 0.0344266038407766], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 13, 0, 0.0, 93.0, 77, 243, 80.0, 179.79999999999995, 243.0, 243.0, 0.06852817298619421, 0.04208881778358803, 0.03775432847661871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 612.6, 482, 690, 627.0, 690.0, 690.0, 690.0, 0.08095854922279792, 23.804501548332254, 0.046171672603626944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 853.8, 695, 928, 887.0, 928.0, 928.0, 928.0, 0.0803780985757001, 72.32435438804134, 0.04576214010706362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 178.8, 79, 247, 242.0, 247.0, 247.0, 247.0, 0.08126909823808594, 0.14380820899161303, 0.044999588575190166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 81.07692307692308, 79, 84, 81.0, 83.6, 84.0, 84.0, 0.07045726766715987, 0.05236130927217643, 0.035366245684492356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 106.23076923076923, 78, 245, 82.0, 243.8, 245.0, 245.0, 0.0703950788424883, 0.018836183205900192, 0.04014719340235661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 105.38461538461539, 79, 240, 81.0, 238.0, 240.0, 240.0, 0.07045726766715987, 0.018990435425914186, 0.04142116712463891], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 103.61538461538463, 78, 236, 80.0, 235.2, 236.0, 236.0, 0.07039850971770198, 0.01897459832234936, 0.04145537242165458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/818cbb30-2076-44d8-ba47-239fd7a45a64", 3, 0, 0.0, 308.6666666666667, 192, 473, 261.0, 473.0, 473.0, 473.0, 0.017959232542129368, 0.02475825189320243, 0.011516825555987908], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d600572f-6478-47d6-b52d-517153cf6e59", 1, 0, 0.0, 461.0, 461, 461, 461.0, 461.0, 461.0, 461.0, 2.1691973969631237, 0.3918960140997831, 1.495559924078091], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 82.2, 80, 85, 82.0, 85.0, 85.0, 85.0, 0.08148498231775884, 0.060556710492006324, 0.04575572737569466], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 724.7692307692308, 79, 1278, 889.0, 1154.0, 1278.0, 1278.0, 0.08868151058720804, 61.38688449489057, 0.04627266921114385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 13, 0, 0.0, 308.0, 79, 1000, 83.0, 975.1999999999999, 1000.0, 1000.0, 0.06858638191007799, 14.255946365119604, 0.03896110426712813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 501.4615384615384, 77, 698, 622.0, 696.4, 698.0, 698.0, 0.0886809056366948, 20.063308786913428, 0.046358956004038394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 13, 0, 0.0, 241.53846153846152, 78, 627, 84.0, 625.0, 627.0, 627.0, 0.06853034049036094, 4.6642536354027735, 0.03899619360084767], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 613.0833333333334, 187, 1372, 486.0, 1288.9000000000003, 1372.0, 1372.0, 0.07185241513930388, 0.012981149219503142, 0.04953887215659037], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c2b8f3fe-6094-4cc3-8aff-fe7c2bd5ada0", 1, 0, 0.0, 437.0, 437, 437, 437.0, 437.0, 437.0, 437.0, 2.288329519450801, 0.730745852402746, 1.365399742562929], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 224.46153846153848, 159, 328, 168.0, 326.4, 328.0, 328.0, 0.070363454304349, 0.10904961130957214, 0.15824905787394117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aca04a6b-3640-41a7-9431-53b900e1aa5e", 3, 0, 0.0, 374.3333333333333, 188, 509, 426.0, 509.0, 509.0, 509.0, 0.06301859048419284, 0.028514271084970066, 0.040412312257115855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 712.5238095238096, 105, 1906, 734.0, 1092.0000000000002, 1828.599999999999, 1906.0, 0.0903311281067456, 0.05548660115150681, 0.040843078431077345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 82.07692307692307, 78, 86, 82.0, 85.6, 86.0, 86.0, 0.08867727610693114, 0.06590176476306114, 0.04451183585836193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 136.3076923076923, 78, 244, 84.0, 243.2, 244.0, 244.0, 0.08868211554597485, 0.12618814848796991, 0.044847355908616486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44fa02d5-e705-4116-989d-5dc3e2db32e4", 3, 0, 0.0, 817.0, 198, 1151, 1102.0, 1151.0, 1151.0, 1151.0, 0.017837924616930567, 0.024591019125228174, 0.011439033689893626], "isController": false}, {"data": ["login", 21, 0, 0.0, 3005.8571428571427, 1684, 6825, 2723.0, 4020.8, 6549.499999999996, 6825.0, 0.088931425401356, 25.453936532341395, 0.16928980184172748], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/b8ce4a9a-0bd9-4736-924d-5ec71f188def", 3, 0, 0.0, 594.3333333333333, 174, 1134, 475.0, 1134.0, 1134.0, 1134.0, 0.018598768761507987, 0.021983115030284998, 0.011926944811253497], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 13, 0, 0.0, 235.6923076923077, 80, 1840, 89.0, 1196.7999999999993, 1840.0, 1840.0, 0.07127232057193296, 0.05769995483801994, 0.025335082703304295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=10b728c0-03ff-497c-b87c-fe1d7a4946ee", 1, 0, 0.0, 687.0, 687, 687, 687.0, 687.0, 687.0, 687.0, 1.455604075691412, 0.262975345705968, 1.0035707787481805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 808.4615384615385, 159, 1364, 975.0, 1241.1999999999998, 1364.0, 1364.0, 0.08862891075068687, 81.59399761767192, 0.1818850069710047], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ad65d324-89e3-4003-aa68-9cbe627effa2", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 0.3635091800804829, 1.3872296277665996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c73eaacc-7ed9-4c55-9110-ff8ea78b525e", 1, 0, 0.0, 365.0, 365, 365, 365.0, 365.0, 365.0, 365.0, 2.73972602739726, 0.8748929794520548, 1.6347388698630136], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=645ab5e7-edc0-4a9f-8e62-b4d308a4d9d6", 1, 0, 0.0, 960.0, 960, 960, 960.0, 960.0, 960.0, 960.0, 1.0416666666666667, 0.18819173177083334, 0.7181803385416667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 258.64285714285717, 159, 495, 250.0, 415.5, 495.0, 495.0, 0.11619414381515171, 0.18007822874477125, 0.2613233527405219], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 0, 0.0, 936.6, 780, 1011, 970.0, 1011.0, 1011.0, 1011.0, 0.08027099487871053, 96.03201658800108, 0.18100168669427988], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1143.8636363636365, 444, 1680, 1215.0, 1599.5, 1669.4999999999998, 1680.0, 0.0920602241248002, 0.028964971084720514, 0.041534983931306335], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 115.64999999999998, 82, 268, 88.0, 248.70000000000002, 267.09999999999997, 268.0, 0.09606332494380294, 0.0745804134085189, 0.034147510038617455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 13, 0, 0.0, 428.38461538461536, 164, 1083, 318.0, 1058.6, 1083.0, 1083.0, 0.06849748140029928, 18.992460090337637, 0.1500080435143423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 279.9473684210526, 162, 1045, 175.0, 417.0, 1045.0, 1045.0, 0.10258293020041465, 6.609818485578999, 0.2293300035499093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 94.35714285714285, 78, 240, 81.0, 171.0, 240.0, 240.0, 0.07489033914625012, 0.055655808681930034, 0.03759143976677009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 104.42857142857143, 78, 246, 81.5, 241.0, 246.0, 246.0, 0.07489073976002868, 0.020039123724851424, 0.04271112501939135], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/10b728c0-03ff-497c-b87c-fe1d7a4946ee", 3, 0, 0.0, 765.6666666666666, 345, 1542, 410.0, 1542.0, 1542.0, 1542.0, 0.03224280985340269, 0.026879503917501397, 0.020676541475001076], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 103.85714285714286, 78, 243, 82.5, 236.5, 243.0, 243.0, 0.074891541000444, 0.02018561066027592, 0.04402803484596415], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 103.57142857142857, 77, 242, 80.0, 236.0, 242.0, 242.0, 0.07483109552723852, 0.020169318716326008, 0.04406557676066878], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 929.1379310344828, 624, 1679, 865.0, 1286.2, 1337.05, 1679.0, 0.2531148399485042, 302.81334553448687, 0.4998029359139409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=48d7c0ff-7431-420a-90d8-fffaf449ef66", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 0.5074833216292135, 1.9366660814606742], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1143.8636363636365, 444, 1680, 1215.0, 1599.5, 1669.4999999999998, 1680.0, 0.09242571283331022, 0.029079965046275875, 0.04169988215721614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04eee995-cada-4e49-a301-53499efb060f", 3, 0, 0.0, 732.0, 194, 1033, 969.0, 1033.0, 1033.0, 1033.0, 0.06940909721900884, 0.03140580896302809, 0.04451039112026283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 112.15384615384616, 79, 324, 82.0, 288.4, 324.0, 324.0, 0.06230201139647563, 0.01679233900920632, 0.036687610226635546], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 124.61538461538461, 79, 331, 82.0, 296.59999999999997, 331.0, 331.0, 0.06225636212131371, 0.016780035103010335, 0.036599931637725444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 123.3, 77, 778, 80.5, 226.20000000000033, 751.1999999999996, 778.0, 0.09726207265476827, 4.400733606781598, 0.05676153771336867], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 139.20000000000002, 77, 613, 81.0, 247.70000000000002, 594.7499999999998, 613.0, 0.09718928585312755, 1.453729623658788, 0.0568139712028146], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 104.84615384615384, 76, 240, 80.0, 240.0, 240.0, 240.0, 0.06225457331673212, 0.016657962000766212, 0.03550456134469879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 82.60000000000001, 79, 95, 82.0, 85.0, 94.5, 95.0, 0.09725923476434087, 0.0722795680231088, 0.048819576825069544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 95.53846153846155, 79, 249, 83.0, 184.99999999999994, 249.0, 249.0, 0.06230051853200808, 0.04629950644810367, 0.031271939966261875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 105.05, 77, 247, 80.0, 238.70000000000002, 246.6, 247.0, 0.09726207265476827, 0.03332935673296698, 0.05506135109176677], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 89.92307692307692, 83, 98, 92.0, 97.2, 98.0, 98.0, 0.06072950145750803, 0.04780075993628074, 0.02158743997122356], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 793.25, 410, 2261, 488.0, 1928.0000000000011, 2261.0, 2261.0, 0.07191312894024018, 0.012992118021430113, 0.04894868249155021], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/393697e1-2f9a-4609-baae-0dbfbe7c49c5", 1, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 5.617977528089887, 1.794022120786517, 3.352133075842697], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1649.1428571428569, 932, 5074, 1474.0, 2200.4, 4788.799999999996, 5074.0, 0.08919318394182905, 0.046164440907391996, 0.04102538050449364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 234.76923076923077, 161, 581, 168.0, 480.19999999999993, 581.0, 581.0, 0.062228945075775706, 0.09644271077661723, 0.13995435596631978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88ba9295-139a-4ddf-b586-a3c2197a5de5", 2, 0, 0.0, 269.5, 188, 351, 269.5, 351.0, 351.0, 351.0, 0.01382007642502263, 0.02731624480883379, 0.008590311176295804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d600572f-6478-47d6-b52d-517153cf6e59", 3, 0, 0.0, 432.66666666666663, 227, 737, 334.0, 737.0, 737.0, 737.0, 0.03511153765127221, 0.02892815813651366, 0.022516187881837974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8ff450a3-f175-494c-b3d6-62d1cd643f5d", 1, 0, 0.0, 1372.0, 1372, 1372, 1372.0, 1372.0, 1372.0, 1372.0, 0.7288629737609329, 0.13167934584548105, 0.5025168549562682], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 1078.5081967213112, 419, 3895, 792.0, 1801.600000000001, 3383.399999999999, 3895.0, 0.28915571272142926, 86.16738860542807, 1.053022299356747], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a5a7b081-6829-42f1-bd27-126a4b952672", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 0.2932858157467533, 1.1192420860389611], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 138.31034482758625, 80, 559, 84.0, 321.1, 334.1, 559.0, 0.2537293844875104, 0.1885625601513627, 0.12265238800909926], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 515.0, 383, 726, 479.5, 640.4, 702.4, 726.0, 0.25394601458000393, 74.6685600877865, 0.1277169897545918], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 121.24137931034484, 78, 336, 85.0, 238.5, 247.89999999999978, 336.0, 0.25430119784633193, 0.44999391650151704, 0.12367382473386064], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 784.3275862068965, 541, 1086, 769.0, 1010.0, 1018.0999999999999, 1086.0, 0.2537715705834996, 228.34410529387185, 0.1273814328905457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 176.31578947368422, 80, 1445, 87.0, 244.0, 1445.0, 1445.0, 0.1042026577162068, 0.07784671206337716, 0.03704078848505789], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, 2.7777777777777777, 205.85555555555553, 80, 3150, 92.0, 394.9, 522.2999999999996, 2483.369999999998, 0.7517352555482238, 1.5990769448017508, 0.3621111009893671], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 111.85714285714285, 79, 242, 87.5, 241.0, 242.0, 242.0, 0.07556906202600656, 0.058521744322874214, 0.026862440017057017], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 104.42857142857143, 82, 332, 85.5, 215.0, 332.0, 332.0, 0.10667316865027963, 0.08656777651209217, 0.03791897791865409], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ad65d324-89e3-4003-aa68-9cbe627effa2", 3, 0, 0.0, 322.0, 190, 494, 282.0, 494.0, 494.0, 494.0, 0.01985400686948638, 0.02737035126701654, 0.01273189893648703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=818cbb30-2076-44d8-ba47-239fd7a45a64", 1, 0, 0.0, 1095.0, 1095, 1095, 1095.0, 1095.0, 1095.0, 1095.0, 0.91324200913242, 0.1649900114155251, 0.6296375570776256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 223.5714285714286, 162, 484, 168.0, 408.5, 484.0, 484.0, 0.07479791206971165, 0.11592215474085195, 0.16822225732084564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8ff450a3-f175-494c-b3d6-62d1cd643f5d", 3, 0, 0.0, 341.0, 192, 482, 349.0, 482.0, 482.0, 482.0, 0.05411548243952595, 0.03366363507224417, 0.034702962371701215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 240.90000000000003, 160, 862, 167.5, 330.6, 835.4499999999996, 862.0, 0.09714868606402098, 5.954213558617088, 0.21724685177539224], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44fa02d5-e705-4116-989d-5dc3e2db32e4", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8ce4a9a-0bd9-4736-924d-5ec71f188def", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 89.76923076923077, 81, 101, 87.0, 99.4, 101.0, 101.0, 0.0720026142487635, 0.05969747997773457, 0.025594679283740148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/48d7c0ff-7431-420a-90d8-fffaf449ef66", 3, 0, 0.0, 791.3333333333334, 409, 1502, 463.0, 1502.0, 1502.0, 1502.0, 0.07526908698597486, 0.03405730172868003, 0.04826826216222997], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 102.07692307692307, 81, 240, 88.0, 191.59999999999997, 240.0, 240.0, 0.08404773911581778, 0.06525190683308119, 0.029876344763825852], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/645ab5e7-edc0-4a9f-8e62-b4d308a4d9d6", 3, 0, 0.0, 913.3333333333334, 183, 2261, 296.0, 2261.0, 2261.0, 2261.0, 0.018523892734311806, 0.025536681552672687, 0.011878928608917401], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 83.15789473684211, 79, 92, 83.0, 87.0, 92.0, 92.0, 0.10262947518527321, 0.07627053771093058, 0.05151518578635784], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aca04a6b-3640-41a7-9431-53b900e1aa5e", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 0.9661179812834224, 3.6869151069518717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 101.94736842105263, 77, 317, 80.0, 239.0, 317.0, 317.0, 0.10262947518527321, 0.03557427943305317, 0.05807722665449517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 161.21052631578948, 77, 960, 82.0, 245.0, 960.0, 960.0, 0.10262836648049521, 4.886478552359373, 0.059870063710609614], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 163.89473684210526, 78, 625, 81.0, 333.0, 625.0, 625.0, 0.10262947518527321, 1.6144414019456388, 0.059970934589914225], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 54.54545454545455, 0.4480955937266617], "isController": false}, {"data": ["401/Unauthorized", 5, 45.45454545454545, 0.37341299477221807], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1339, 11, "406/Not Acceptable", 6, "401/Unauthorized", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

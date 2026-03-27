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

    var data = {"OkPercent": 98.11320754716981, "KoPercent": 1.8867924528301887};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7944046844502277, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.13392857142857142, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3a9d17d7-e752-497d-b780-3b0be02dbab9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2d085fc-c6a3-49b6-97fb-f2175f14a9c2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/15ba5814-3983-4983-96fc-989759b67127"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=69963a94-22b0-4cf0-b859-5732a203afc0"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e7559186-c792-454e-bc5b-1cadb1c31a26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.7619047619047619, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ffc9f7f4-fb14-439c-bec4-d99235d6fb8a"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2bf050b2-8b16-4c1b-a0fd-2844723f09e2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2516986c-34a8-4582-bd29-82cdc072bb46"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bdb10316-4a15-45ae-bd93-edfb723b9032"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/69963a94-22b0-4cf0-b859-5732a203afc0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.41964285714285715, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eaed36fc-9624-449f-aeab-5fdf16e91977"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.4523809523809524, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28688524590163933, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f2d085fc-c6a3-49b6-97fb-f2175f14a9c2"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5267857142857143, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=86044d10-0a9c-474e-9a4d-e2995214cd90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c098c883-d273-44df-af9f-55ae126e3b80"], "isController": false}, {"data": [0.9157303370786517, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/86044d10-0a9c-474e-9a4d-e2995214cd90"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f7227278-d4f1-4d8a-8ace-6a694eea9816"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e7559186-c792-454e-bc5b-1cadb1c31a26"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7227278-d4f1-4d8a-8ace-6a694eea9816"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c098c883-d273-44df-af9f-55ae126e3b80"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaed36fc-9624-449f-aeab-5fdf16e91977"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3a9d17d7-e752-497d-b780-3b0be02dbab9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffc9f7f4-fb14-439c-bec4-d99235d6fb8a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/01007f11-64ea-43d9-a54d-30a14caadf50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2bf050b2-8b16-4c1b-a0fd-2844723f09e2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bdb10316-4a15-45ae-bd93-edfb723b9032"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2516986c-34a8-4582-bd29-82cdc072bb46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 25, 1.8867924528301887, 343.0015094339621, 98, 1909, 112.0, 938.400000000001, 1193.4, 1583.6000000000008, 5.17139768243325, 713.081659510054, 3.793705018597517], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 1669.2678571428578, 1223, 2188, 1638.5, 2070.8, 2125.25, 2188.0, 0.25922685590227146, 311.93747537200215, 1.2746164252616572], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/3a9d17d7-e752-497d-b780-3b0be02dbab9", 3, 0, 0.0, 334.33333333333337, 185, 609, 209.0, 609.0, 609.0, 609.0, 0.023214783173925155, 0.023282795234005012, 0.014887084261924659], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2d085fc-c6a3-49b6-97fb-f2175f14a9c2", 3, 0, 0.0, 317.3333333333333, 203, 467, 282.0, 467.0, 467.0, 467.0, 0.020053475935828877, 0.023702529662433157, 0.012859813669786098], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/15ba5814-3983-4983-96fc-989759b67127", 1, 0, 0.0, 226.0, 226, 226, 226.0, 226.0, 226.0, 226.0, 4.424778761061947, 1.4129908738938053, 2.6401756084070795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=69963a94-22b0-4cf0-b859-5732a203afc0", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 584.4615384615383, 105, 1260, 412.0, 1236.0, 1260.0, 1260.0, 0.06716680100026866, 0.012724960345754025, 0.04540520148748631], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 584.4615384615383, 105, 1260, 412.0, 1236.0, 1260.0, 1260.0, 0.06844266610508583, 0.012966676976940086, 0.04626769473254712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 139.17647058823528, 100, 306, 105.0, 306.0, 306.0, 306.0, 0.09106736306414892, 0.024367634257399223, 0.05193685549752243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 114.94117647058823, 98, 309, 103.0, 144.99999999999986, 309.0, 309.0, 0.0910668752276672, 0.06767762895337376, 0.04571130260451264], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 150.76470588235293, 98, 309, 104.0, 307.4, 309.0, 309.0, 0.0910668752276672, 0.024545368713707175, 0.053626294689729806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 150.2941176470588, 99, 304, 105.0, 304.0, 304.0, 304.0, 0.0910668752276672, 0.024545368713707175, 0.05353736219439029], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 201.92307692307693, 103, 272, 203.0, 258.8, 272.0, 272.0, 0.06696405575530304, 0.14296765539524248, 0.0432861853796862], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 102.88235294117646, 100, 105, 103.0, 105.0, 105.0, 105.0, 0.11788037222461065, 0.08760445631145382, 0.05917042121430652], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 114.05882352941175, 100, 305, 102.0, 144.19999999999987, 305.0, 305.0, 0.11788200704518348, 0.04195754340831554, 0.06664721469087177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 803.5714285714286, 706, 911, 801.0, 911.0, 911.0, 911.0, 0.041073786122927974, 12.077056898195686, 0.02342489364823236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 934.5714285714286, 704, 1183, 906.0, 1183.0, 1183.0, 1183.0, 0.04104994018437287, 36.936808335996695, 0.023371206179188853], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 296.0, 100, 541, 305.0, 541.0, 541.0, 541.0, 0.04119367500544345, 0.07289349522447611, 0.02280938840633441], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 103.53333333333333, 101, 110, 103.0, 108.2, 110.0, 110.0, 0.08101670564470394, 0.06020870409728486, 0.04066658857556428], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 156.86666666666667, 101, 313, 104.0, 309.4, 313.0, 313.0, 0.08101670564470394, 0.029790517804771346, 0.04575123077878659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 222.66666666666669, 99, 1095, 104.0, 622.2000000000003, 1095.0, 1095.0, 0.08101670564470394, 4.880312375099246, 0.04716480350748325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 163.73333333333332, 101, 805, 103.0, 509.20000000000016, 805.0, 805.0, 0.0810149553607596, 1.6084527797581432, 0.047242900726974194], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e7559186-c792-454e-bc5b-1cadb1c31a26", 1, 0, 0.0, 262.0, 262, 262, 262.0, 262.0, 262.0, 262.0, 3.8167938931297707, 0.6895574904580153, 2.6315004770992365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 131.14285714285714, 101, 302, 104.0, 302.0, 302.0, 302.0, 0.04124294451056408, 0.03065027419193288, 0.0231588799741937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 552.9, 99, 1326, 105.0, 1274.8000000000002, 1323.8999999999999, 1326.0, 0.10048635395313316, 40.702905382363134, 0.05518898971019735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 185.76470588235296, 100, 1114, 103.0, 467.59999999999945, 1114.0, 1114.0, 0.11788282447247436, 6.269384844516021, 0.0687062923424704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 432.7, 100, 1019, 202.5, 916.2, 1013.8999999999999, 1019.0, 0.10038598410889871, 13.297447043256321, 0.05523189789741557], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 185.47058823529412, 99, 907, 103.0, 426.99999999999955, 907.0, 907.0, 0.11788200704518348, 2.06879942809891, 0.0688209350643497], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 370.6923076923077, 143, 698, 382.0, 615.1999999999999, 698.0, 698.0, 0.06861498023360761, 0.012999322427070194, 0.0469305434966194], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 328.26666666666665, 206, 1197, 209.0, 727.2000000000003, 1197.0, 1197.0, 0.08096991158085655, 6.574999308382005, 0.1807221014795902], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 115.19999999999999, 100, 310, 104.0, 112.80000000000001, 300.14999999999986, 310.0, 0.10048181028029401, 0.07467447033525756, 0.050437158675850705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 465.9523809523809, 109, 916, 375.0, 898.0, 915.0, 916.0, 0.09146182122262678, 0.0561811382314768, 0.041354319556715036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 177.89999999999995, 100, 413, 103.0, 307.0, 407.69999999999993, 413.0, 0.1003849763844343, 0.09470891180175975, 0.05345696056878128], "isController": false}, {"data": ["login", 21, 0, 0.0, 2205.0, 1180, 2995, 2288.0, 2912.6, 2988.9, 2995.0, 0.08875289503490948, 35.51245436225762, 0.18296617326044326], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 110.0, 100, 184, 105.0, 124.79999999999995, 184.0, 184.0, 0.1122334455667789, 0.09086086560044894, 0.03989548260381594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 679.4999999999999, 205, 1432, 415.0, 1379.6000000000001, 1429.85, 1432.0, 0.1003290793803676, 54.098326299324285, 0.2140908899941809], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffc9f7f4-fb14-439c-bec4-d99235d6fb8a", 3, 0, 0.0, 269.0, 194, 417, 196.0, 417.0, 417.0, 417.0, 0.015531648322064261, 0.021411631068991584, 0.009960073956532093], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 303.29411764705884, 206, 613, 212.0, 452.9999999999999, 613.0, 613.0, 0.0910166560480568, 0.14105804018385365, 0.20469859265495585], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, 22.22222222222222, 862.3333333333333, 103, 1285, 1010.0, 1285.0, 1285.0, 1285.0, 0.052746943607656506, 49.083778263570615, 0.10027413758747201], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2bf050b2-8b16-4c1b-a0fd-2844723f09e2", 1, 0, 0.0, 375.0, 375, 375, 375.0, 375.0, 375.0, 375.0, 2.6666666666666665, 0.4817708333333333, 1.8385416666666667], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2516986c-34a8-4582-bd29-82cdc072bb46", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 0.49632984203296704, 1.8941019917582418], "isController": false}, {"data": ["register", 22, 7, 31.818181818181817, 1013.7272727272726, 134, 1876, 931.5, 1851.4, 1872.3999999999999, 1876.0, 0.09289559801541222, 0.029079357120236463, 0.041911881135859815], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bdb10316-4a15-45ae-bd93-edfb723b9032", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 131.1764705882353, 102, 310, 106.0, 305.2, 310.0, 310.0, 0.0821593407921127, 0.06378581633762656, 0.029205078172196315], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 337.70588235294116, 206, 1217, 209.0, 572.1999999999994, 1217.0, 1217.0, 0.11779624022117977, 8.461543208700292, 0.26315360673032284], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/69963a94-22b0-4cf0-b859-5732a203afc0", 3, 0, 0.0, 402.0, 272, 652, 282.0, 652.0, 652.0, 652.0, 0.025249762231405654, 0.029844364147862606, 0.01619206757678032], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 454.26666666666665, 206, 1410, 407.0, 1343.4, 1410.0, 1410.0, 0.17107859350585658, 27.519049868697177, 0.3789234915145018], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 5, 0, 0.0, 145.4, 102, 306, 104.0, 306.0, 306.0, 306.0, 0.041897802879217017, 0.031136941397543114, 0.021030733085856977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 5, 0, 0.0, 183.8, 102, 305, 104.0, 305.0, 305.0, 305.0, 0.041898505061339415, 0.01121112342461621, 0.023895241167795133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 5, 0, 0.0, 102.0, 101, 103, 102.0, 103.0, 103.0, 103.0, 0.04196989918830215, 0.011312199390597064, 0.024673710264997945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 5, 0, 0.0, 186.2, 103, 316, 104.0, 316.0, 316.0, 316.0, 0.04189464335090115, 0.011291915590672576, 0.02467038080136074], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 2.0623907342657346, 4.3228256118881125], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1154.8214285714284, 804, 1762, 1109.5, 1607.9, 1695.1499999999999, 1762.0, 0.25339481174122963, 303.14828913253, 0.500355770840592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, 31.818181818181817, 1013.7272727272726, 134, 1876, 931.5, 1851.4, 1872.3999999999999, 1876.0, 0.08889571320626634, 0.027827262496918956, 0.04010724560673345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 11, 0, 0.0, 166.0909090909091, 101, 401, 102.0, 382.00000000000006, 401.0, 401.0, 0.06363972970471166, 0.017152895896973063, 0.03747534864447376], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 11, 0, 0.0, 102.63636363636364, 101, 104, 102.0, 104.0, 104.0, 104.0, 0.06363899334683251, 0.017152697425513452, 0.03741276757304021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 114.6470588235294, 101, 301, 103.0, 145.79999999999987, 301.0, 301.0, 0.08203722559754467, 0.02211159596183821, 0.04822891582980653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 138.29411764705884, 101, 307, 103.0, 305.4, 307.0, 307.0, 0.08203762148806594, 0.02211170266670527, 0.04830926343486695], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaed36fc-9624-449f-aeab-5fdf16e91977", 3, 0, 0.0, 325.0, 188, 412, 375.0, 412.0, 412.0, 412.0, 0.07917238467222633, 0.03505027446426686, 0.05077135345191597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 115.3529411764706, 102, 305, 103.0, 146.59999999999985, 305.0, 305.0, 0.08203801738240815, 0.06096770627735606, 0.041179239193904094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 11, 0, 0.0, 156.9090909090909, 102, 301, 103.0, 300.8, 301.0, 301.0, 0.06363936152364202, 0.017028501032693277, 0.036294323368952094], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 162.23529411764707, 100, 305, 105.0, 305.0, 305.0, 305.0, 0.08203841328057138, 0.021951684803590388, 0.04678753257407586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 11, 0, 0.0, 140.45454545454547, 103, 308, 104.0, 306.8, 308.0, 308.0, 0.06363899334683251, 0.047294212829042524, 0.03194379158229679], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 505.30769230769226, 103, 1351, 427.0, 1071.3999999999996, 1351.0, 1351.0, 0.06784756218490026, 0.012711224465830924, 0.04617630058557665], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 11, 0, 0.0, 105.90909090909092, 102, 110, 105.0, 109.6, 110.0, 110.0, 0.06460858941828776, 0.05085402643666009, 0.022966334519781976], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1080.2857142857144, 654, 1909, 981.0, 1724.8000000000004, 1900.3, 1909.0, 0.08993537500910061, 0.04654858276838215, 0.04136675940359998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 11, 0, 0.0, 325.8181818181818, 206, 703, 208.0, 685.4000000000001, 703.0, 703.0, 0.06360072620465558, 0.09856870360037928, 0.1430395238762908], "isController": false}, {"data": ["addBook", 61, 14, 22.950819672131146, 970.5901639344263, 521, 2123, 820.0, 1817.6000000000001, 1872.0, 2123.0, 0.2920183253467119, 75.5822377160816, 1.0643821119626984], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f2d085fc-c6a3-49b6-97fb-f2175f14a9c2", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 0.47294257198952877, 1.804851112565445], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 183.1785714285714, 101, 557, 104.0, 416.20000000000005, 454.54999999999995, 557.0, 0.25421843719215736, 0.18892600654612476, 0.12288879532238076], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 667.8750000000002, 497, 1039, 607.5, 836.4000000000003, 909.35, 1039.0, 0.2540500569344324, 74.69915199451978, 0.1277693157433913], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 170.28571428571425, 101, 315, 106.0, 309.6, 313.0, 315.0, 0.2546311031892546, 0.45057769431536066, 0.1238342669807117], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 969.5714285714284, 690, 1409, 910.0, 1230.5000000000002, 1323.1499999999999, 1409.0, 0.2539290993678979, 228.48584997097953, 0.12746050495615188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 121.2, 103, 318, 106.0, 205.80000000000007, 318.0, 318.0, 0.17368951262722757, 0.1297582784763956, 0.06174119394170979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=86044d10-0a9c-474e-9a4d-e2995214cd90", 1, 0, 0.0, 474.0, 474, 474, 474.0, 474.0, 474.0, 474.0, 2.109704641350211, 0.3811478111814346, 1.4545424578059072], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c098c883-d273-44df-af9f-55ae126e3b80", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 0.8943765470297029, 3.4131342821782176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, 7.865168539325842, 153.0112359550561, 100, 907, 108.0, 242.19999999999982, 306.39999999999986, 898.3100000000001, 0.728663067016534, 1.5299517810797314, 0.35087937837467204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/86044d10-0a9c-474e-9a4d-e2995214cd90", 3, 0, 0.0, 669.0, 208, 1437, 362.0, 1437.0, 1437.0, 1437.0, 0.03243208181533173, 0.027037292164409032, 0.02079791704954541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 5, 0, 0.0, 149.0, 104, 312, 108.0, 312.0, 312.0, 312.0, 0.04258037044922291, 0.032974837662337664, 0.015135991058122206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7227278-d4f1-4d8a-8ace-6a694eea9816", 3, 0, 0.0, 275.0, 196, 422, 207.0, 422.0, 422.0, 422.0, 0.01643232347576506, 0.022653284479122734, 0.01053765535392486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e7559186-c792-454e-bc5b-1cadb1c31a26", 3, 0, 0.0, 556.6666666666666, 239, 1042, 389.0, 1042.0, 1042.0, 1042.0, 0.07501875468867217, 0.0339440328832208, 0.04810773005751438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 118.4705882352941, 103, 310, 107.0, 151.59999999999985, 310.0, 310.0, 0.09462265043609909, 0.07678849854726401, 0.0336353952722071], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7227278-d4f1-4d8a-8ace-6a694eea9816", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c098c883-d273-44df-af9f-55ae126e3b80", 3, 0, 0.0, 326.3333333333333, 227, 459, 293.0, 459.0, 459.0, 459.0, 0.08263097008758884, 0.03884085963752548, 0.05298926141684571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 5, 0, 0.0, 332.2, 206, 612, 216.0, 612.0, 612.0, 612.0, 0.04178715295769469, 0.06476192553111472, 0.0939802863882528], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaed36fc-9624-449f-aeab-5fdf16e91977", 1, 0, 0.0, 181.0, 181, 181, 181.0, 181.0, 181.0, 181.0, 5.524861878453039, 0.9981439917127072, 3.8091332872928176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 302.94117647058823, 206, 609, 210.0, 451.39999999999986, 609.0, 609.0, 0.08199646932849715, 0.12707851252375488, 0.18441198131203998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 119.53333333333333, 103, 302, 106.0, 188.60000000000008, 302.0, 302.0, 0.08243298198564566, 0.06834531416583317, 0.02930234906520998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3a9d17d7-e752-497d-b780-3b0be02dbab9", 1, 0, 0.0, 491.0, 491, 491, 491.0, 491.0, 491.0, 491.0, 2.0366598778004072, 0.3679512474541752, 1.404181517311609], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffc9f7f4-fb14-439c-bec4-d99235d6fb8a", 1, 0, 0.0, 698.0, 698, 698, 698.0, 698.0, 698.0, 698.0, 1.4326647564469914, 0.25883103510028654, 0.9877551934097422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 126.20000000000002, 102, 306, 106.0, 285.60000000000036, 305.9, 306.0, 0.09909280536686635, 0.07693240260415893, 0.035224395657753274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/01007f11-64ea-43d9-a54d-30a14caadf50", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2bf050b2-8b16-4c1b-a0fd-2844723f09e2", 3, 0, 0.0, 304.3333333333333, 194, 427, 292.0, 427.0, 427.0, 427.0, 0.041990342221289105, 0.035005620582266084, 0.026927400447896988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bdb10316-4a15-45ae-bd93-edfb723b9032", 3, 0, 0.0, 612.6666666666667, 205, 1351, 282.0, 1351.0, 1351.0, 1351.0, 0.02865192684208013, 0.023606128527768493, 0.018373794231412062], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2516986c-34a8-4582-bd29-82cdc072bb46", 3, 0, 0.0, 551.3333333333334, 185, 933, 536.0, 933.0, 933.0, 933.0, 0.024786833234186, 0.029297197745224404, 0.01589520230187058], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 103.4, 100, 107, 103.0, 106.4, 107.0, 107.0, 0.17127784692327894, 0.1272875405357571, 0.0859734505064115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 170.2, 101, 308, 103.0, 306.8, 308.0, 308.0, 0.17127980268566728, 0.08013129310541701, 0.09576503551201243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 295.6666666666667, 101, 1306, 103.0, 1237.6000000000001, 1306.0, 1306.0, 0.17127980268566728, 20.58905889598749, 0.0987312091783137], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 222.73333333333335, 98, 809, 102.0, 686.6000000000001, 809.0, 809.0, 0.17127784692327894, 6.754859295248752, 0.09889734533610423], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 28.0, 0.5283018867924528], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 4.0, 0.07547169811320754], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 4.0, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 16, 64.0, 1.2075471698113207], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 25, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 14, "401/Unauthorized", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

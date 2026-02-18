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

    var data = {"OkPercent": 67.31078904991948, "KoPercent": 32.689210950080515};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5059665871121718, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e93e3464-ff5a-40d2-9164-5de4b310bd71"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/54ea89c1-a3d8-4330-b027-7a07837b9028"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4a269646-4a90-47a5-a837-f81aee5e12f4"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8076923076923077, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=79bcee58-47e2-45e3-9fd8-5b4825ddac88"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5af2fb79-c2a1-4f5a-8252-fd68a88664b2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5750ef5b-170b-4853-8b28-bd13a145b490"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5750ef5b-170b-4853-8b28-bd13a145b490"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0ef3ac74-a5dc-404b-8539-733d6dd46ff4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5af2fb79-c2a1-4f5a-8252-fd68a88664b2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/adcbd51a-fb53-4bc3-a1c0-b0b8f5ab52db"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/79bcee58-47e2-45e3-9fd8-5b4825ddac88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f997e9da-3460-443a-bc15-959f76b87e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02aedec0-cdee-46c3-9c87-1d8aeec51f2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d35ee687-8775-4ff5-a278-131f60a5ce2e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4a269646-4a90-47a5-a837-f81aee5e12f4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b86a6697-c092-4070-bf83-64260badd5c9"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02aedec0-cdee-46c3-9c87-1d8aeec51f2f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e93e3464-ff5a-40d2-9164-5de4b310bd71"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5586b8e7-880e-4e62-b3ed-6a770cfdcd8a"], "isController": false}, {"data": [0.9022346368715084, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e5057b7b-3d90-4d40-abfa-0acb019f7463"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5960bafa-b3e1-4861-bc06-902ac1764583"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b86a6697-c092-4070-bf83-64260badd5c9"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f997e9da-3460-443a-bc15-959f76b87e9b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d35ee687-8775-4ff5-a278-131f60a5ce2e"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e5057b7b-3d90-4d40-abfa-0acb019f7463"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5960bafa-b3e1-4861-bc06-902ac1764583"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=adcbd51a-fb53-4bc3-a1c0-b0b8f5ab52db"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0ef3ac74-a5dc-404b-8539-733d6dd46ff4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/76caf247-76b7-4b7a-a73c-d633685d4dcd"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/256c4c53-bf36-464a-ab71-c3ecfd3b3388"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c3131dfe-3136-4d1e-921b-37bcbaa86f53"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 621, 203, 32.689210950080515, 323.9677938808373, 138, 3144, 156.0, 663.8000000000001, 998.4999999999999, 1971.2199999999987, 2.4723109139986144, 2.6154777710982478, 1.1784594935146628], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e93e3464-ff5a-40d2-9164-5de4b310bd71", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 0.7753822424892703, 2.9590262875536477], "isController": false}, {"data": ["see books", 61, 61, 100.0, 835.1639344262296, 570, 1415, 884.0, 1078.2, 1092.7, 1415.0, 0.2617003659514954, 1.6847924670514949, 0.4393192666705278], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 226.4, 142, 444, 156.0, 438.6, 444.0, 444.0, 0.07937389868715572, 0.06162329048465702, 0.028214940548949883], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, 100.0, 183.70588235294122, 141, 451, 149.0, 441.4, 451.0, 451.0, 0.08542713567839197, 0.04246329302763819, 0.04288041771356784], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/54ea89c1-a3d8-4330-b027-7a07837b9028", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 147.2941176470588, 139, 155, 146.0, 155.0, 155.0, 155.0, 0.09626383084746147, 0.04784989248179481, 0.04831993071835468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4a269646-4a90-47a5-a837-f81aee5e12f4", 3, 0, 0.0, 367.3333333333333, 224, 540, 338.0, 540.0, 540.0, 540.0, 0.03546979746745646, 0.02956971071424349, 0.02274593131864884], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, 100.0, 270.21311475409834, 138, 962, 153.0, 593.6, 611.9, 962.0, 0.2665804286263678, 0.1325092169636926, 0.1288645626660665], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 561.6923076923076, 414, 1229, 448.0, 1057.3999999999999, 1229.0, 1229.0, 0.0793432817602002, 0.014334479614879917, 0.053928636821386065], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 561.6923076923076, 414, 1229, 448.0, 1057.3999999999999, 1229.0, 1229.0, 0.07696816478292018, 0.013905381332851787, 0.05231429950089105], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=79bcee58-47e2-45e3-9fd8-5b4825ddac88", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, 21.73913043478261, 972.0000000000001, 293, 1763, 999.0, 1550.6000000000001, 1727.7999999999995, 1763.0, 0.09493030877114779, 0.030052665684344344, 0.042829885402607695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5af2fb79-c2a1-4f5a-8252-fd68a88664b2", 1, 0, 0.0, 433.0, 433, 433, 433.0, 433.0, 433.0, 433.0, 2.3094688221709005, 0.417238019630485, 1.5922704965357968], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5750ef5b-170b-4853-8b28-bd13a145b490", 1, 0, 0.0, 443.0, 443, 443, 443.0, 443.0, 443.0, 443.0, 2.257336343115124, 0.40781955417607224, 1.5563275959367946], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5750ef5b-170b-4853-8b28-bd13a145b490", 3, 0, 0.0, 338.3333333333333, 232, 492, 291.0, 492.0, 492.0, 492.0, 0.04893485140116791, 0.032033849663980686, 0.031380747806087496], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0ef3ac74-a5dc-404b-8539-733d6dd46ff4", 3, 0, 0.0, 446.0, 237, 747, 354.0, 747.0, 747.0, 747.0, 0.036521231008959876, 0.03008959494911375, 0.02342019045821971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5af2fb79-c2a1-4f5a-8252-fd68a88664b2", 3, 0, 0.0, 362.0, 225, 586, 275.0, 586.0, 586.0, 586.0, 0.04469540084325323, 0.028734836154109746, 0.028662089733466428], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 283.88888888888886, 148, 606, 152.0, 606.0, 606.0, 606.0, 0.04983747445829434, 0.03922754337244652, 0.017715664748846817], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 557.4615384615386, 385, 768, 510.0, 759.6, 768.0, 768.0, 0.07660171234289284, 0.013839176546323412, 0.052140032717769826], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/adcbd51a-fb53-4bc3-a1c0-b0b8f5ab52db", 3, 0, 0.0, 967.0, 325, 1858, 718.0, 1858.0, 1858.0, 1858.0, 0.026797677534613668, 0.026876186355515856, 0.01718470857525681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1228.0, 713, 2722, 1026.0, 2135.2999999999997, 2643.849999999999, 2722.0, 0.10616069834437565, 0.054946455197772553, 0.048829774336133724], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 254.69230769230768, 220, 354, 230.0, 347.6, 354.0, 354.0, 0.07928376268540203, 0.15003880330308353, 0.05125571376732046], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, 100.0, 149.22222222222223, 144, 161, 147.0, 161.0, 161.0, 161.0, 0.04938542581211589, 0.02454802904137401, 0.024789168815847234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79bcee58-47e2-45e3-9fd8-5b4825ddac88", 3, 0, 0.0, 692.3333333333334, 221, 1346, 510.0, 1346.0, 1346.0, 1346.0, 0.03219160442956477, 0.026836816062537558, 0.02064370466349043], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f997e9da-3460-443a-bc15-959f76b87e9b", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.5132501775568182, 1.9586736505681819], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02aedec0-cdee-46c3-9c87-1d8aeec51f2f", 3, 0, 0.0, 310.6666666666667, 219, 485, 228.0, 485.0, 485.0, 485.0, 0.022597848684805206, 0.022664053319623973, 0.014491458954774172], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d35ee687-8775-4ff5-a278-131f60a5ce2e", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4a269646-4a90-47a5-a837-f81aee5e12f4", 1, 0, 0.0, 675.0, 675, 675, 675.0, 675.0, 675.0, 675.0, 1.4814814814814814, 0.26765046296296297, 1.021412037037037], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b86a6697-c092-4070-bf83-64260badd5c9", 1, 0, 0.0, 850.0, 850, 850, 850.0, 850.0, 850.0, 850.0, 1.176470588235294, 0.21254595588235295, 0.8111213235294118], "isController": false}, {"data": ["addBook", 59, 59, 100.0, 910.4237288135595, 575, 3637, 823.0, 1102.0, 1639.0, 3637.0, 0.2773194955605379, 0.9056857400200233, 0.5411255411255411], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02aedec0-cdee-46c3-9c87-1d8aeec51f2f", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e93e3464-ff5a-40d2-9164-5de4b310bd71", 3, 0, 0.0, 285.0, 226, 387, 242.0, 387.0, 387.0, 387.0, 0.1328138834779529, 0.06009482357889145, 0.08517036147511953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 200.88235294117646, 143, 435, 154.0, 428.6, 435.0, 435.0, 0.09278209851275754, 0.06931475133033156, 0.03298113658070678], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 519.9230769230769, 233, 1015, 443.0, 949.0, 1015.0, 1015.0, 0.07697272205150067, 0.013906204667507447, 0.05306908375816355], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5586b8e7-880e-4e62-b3ed-6a770cfdcd8a", 1, 0, 0.0, 530.0, 530, 530, 530.0, 530.0, 530.0, 530.0, 1.8867924528301887, 0.6025206367924528, 1.1258107311320753], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, 7.262569832402234, 240.56983240223462, 140, 3144, 157.0, 420.0, 443.0, 2324.7999999999884, 0.7328946883559821, 1.6398686585672932, 0.34863037746123643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 186.77777777777774, 140, 482, 149.0, 482.0, 482.0, 482.0, 0.0416815253585769, 0.032278759384132306, 0.014816479717306633], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 19, 100.0, 205.94736842105266, 140, 647, 150.0, 480.0, 647.0, 647.0, 0.0978750804893754, 0.048650796844816484, 0.04912870251126851], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 206.1176470588235, 144, 457, 156.0, 453.8, 457.0, 457.0, 0.08552641508484723, 0.06940669036670707, 0.03040196786219179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e5057b7b-3d90-4d40-abfa-0acb019f7463", 1, 0, 0.0, 513.0, 513, 513, 513.0, 513.0, 513.0, 513.0, 1.949317738791423, 0.35217166179337234, 1.3439632066276803], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5960bafa-b3e1-4861-bc06-902ac1764583", 3, 0, 0.0, 493.33333333333337, 240, 768, 472.0, 768.0, 768.0, 768.0, 0.03428414701042238, 0.02858128271279027, 0.021985602086761747], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b86a6697-c092-4070-bf83-64260badd5c9", 3, 0, 0.0, 432.66666666666663, 230, 723, 345.0, 723.0, 723.0, 723.0, 0.017849917890377702, 0.024607552820882023, 0.011446724688816431], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 632.5909090909091, 156, 3071, 525.0, 889.3, 2749.0999999999954, 3071.0, 0.10270199615334341, 0.06308550349653615, 0.046436547088865236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f997e9da-3460-443a-bc15-959f76b87e9b", 3, 0, 0.0, 302.6666666666667, 220, 441, 247.0, 441.0, 441.0, 441.0, 0.09223674096848578, 0.0417347232897771, 0.05914921214450423], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d35ee687-8775-4ff5-a278-131f60a5ce2e", 3, 0, 0.0, 304.3333333333333, 219, 465, 229.0, 465.0, 465.0, 465.0, 0.028872805666769325, 0.02895739396462119, 0.018515438529796736], "isController": false}, {"data": ["login", 22, 4, 18.181818181818183, 2252.2272727272725, 1238, 4594, 1991.5, 3537.2, 4440.699999999998, 4594.0, 0.10539982465301899, 0.15635929243181348, 0.15835238215580968], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, 100.0, 180.66666666666666, 141, 439, 149.0, 439.0, 439.0, 439.0, 0.04186338581761518, 0.020809046270670047, 0.02101345733423262], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 186.1764705882353, 142, 438, 154.0, 435.6, 438.0, 438.0, 0.08377396797863271, 0.06782091743582667, 0.029779027679904597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e5057b7b-3d90-4d40-abfa-0acb019f7463", 3, 0, 0.0, 276.3333333333333, 217, 385, 227.0, 385.0, 385.0, 385.0, 0.06815548538064838, 0.030838582252311605, 0.04370647988277256], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5960bafa-b3e1-4861-bc06-902ac1764583", 1, 0, 0.0, 1015.0, 1015, 1015, 1015.0, 1015.0, 1015.0, 1015.0, 0.9852216748768472, 0.17799415024630544, 0.6792641625615764], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, 100.0, 146.26666666666668, 140, 159, 146.0, 155.4, 159.0, 159.0, 0.07413814407512666, 0.03685187044359323, 0.03721387310021006], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=adcbd51a-fb53-4bc3-a1c0-b0b8f5ab52db", 1, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 2.450980392156863, 0.44280407475490197, 1.6898360906862746], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 184.47368421052633, 144, 517, 149.0, 434.0, 517.0, 517.0, 0.09532075433834854, 0.07903058636060344, 0.033883549393709834], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, 100.0, 201.88235294117646, 140, 451, 152.0, 439.8, 451.0, 451.0, 0.08580484948819932, 0.042651043349114695, 0.043070012340756296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0ef3ac74-a5dc-404b-8539-733d6dd46ff4", 1, 0, 0.0, 414.0, 414, 414, 414.0, 414.0, 414.0, 414.0, 2.4154589371980677, 0.4363866243961353, 1.6653457125603865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 171.23529411764707, 142, 454, 152.0, 230.79999999999978, 454.0, 454.0, 0.08589893232679996, 0.06668911249981051, 0.030534386100542172], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76caf247-76b7-4b7a-a73c-d633685d4dcd", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 1.4319997197309418, 2.6756936659192823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 167.52941176470586, 141, 437, 151.0, 218.5999999999998, 437.0, 437.0, 0.08734477036032287, 0.04341649229824643, 0.04384298043477144], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, 100.0, 227.75, 140, 467, 152.0, 467.0, 467.0, 467.0, 0.05349810750444703, 0.026592321015394077, 0.030040441225641642], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/256c4c53-bf36-464a-ab71-c3ecfd3b3388", 1, 0, 0.0, 220.0, 220, 220, 220.0, 220.0, 220.0, 220.0, 4.545454545454545, 1.4515269886363635, 2.712180397727273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c3131dfe-3136-4d1e-921b-37bcbaa86f53", 1, 0, 0.0, 235.0, 235, 235, 235.0, 235.0, 235.0, 235.0, 4.25531914893617, 1.3588763297872342, 2.5390625], "isController": false}, {"data": ["register", 23, 5, 21.73913043478261, 972.0000000000001, 293, 1763, 999.0, 1550.6000000000001, 1727.7999999999995, 1763.0, 0.09243258449543865, 0.029261945906844028, 0.041702982457902986], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 2.4630541871921183, 0.8051529790660226], "isController": false}, {"data": ["401/Unauthorized", 13, 6.403940886699507, 2.0933977455716586], "isController": false}, {"data": ["404/Not Found", 185, 91.13300492610837, 29.790660225442835], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 621, 203, "404/Not Found", 185, "401/Unauthorized", 13, "406/Not Acceptable", 5, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 61, 61, "404/Not Found", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 13, "401/Unauthorized", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 9, "404/Not Found", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 15, "404/Not Found", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 4, 4, "404/Not Found", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
